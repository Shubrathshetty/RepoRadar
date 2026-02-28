import { NextResponse } from "next/server";
import { z } from "zod";

import { buildFullRepositoryAnalysis } from "@/lib/analyzers/full-report";
import {
  enhanceAnalysisWithGemini,
  enhanceAnalysisWithGeminiDeepCodePass,
  type GeminiCodeSnippet,
} from "@/lib/analyzers/gemini-enhancer";
import { createGitHubClient } from "@/lib/github/client";
import { parseGitHubRepoUrl } from "@/lib/github/url";
import type { ContributorInsight } from "@/lib/types/analysis";

const MAX_TREE_PATHS = 5000;
const MAX_DEEP_ANALYSIS_FILES = 8;
const MAX_DEEP_FILE_CHARS = 2800;

const requestSchema = z.object({
  repoUrl: z.url(),
  deepAnalysis: z.boolean().optional(),
});

const DETECTION_FILES = [
  "package.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "package-lock.json",
  "requirements.txt",
  "pyproject.toml",
  "Pipfile",
  "poetry.lock",
  "Gemfile",
  "go.mod",
  "Cargo.toml",
  "composer.json",
  "Dockerfile",
];

const DEEP_CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".java"];

function selectDeepAnalysisPaths(paths: string[]): string[] {
  const priorityHints = [
    "src/",
    "app/",
    "lib/",
    "server/",
    "api/",
    "controllers/",
    "services/",
    "routes/",
    "models/",
    "core/",
    "main.",
    "index.",
  ];

  const candidates = paths
    .filter((path) => {
      const lowered = path.toLowerCase();
      if (lowered.includes(".min.") || lowered.includes("/dist/") || lowered.includes("/build/")) {
        return false;
      }
      return DEEP_CODE_EXTENSIONS.some((ext) => lowered.endsWith(ext));
    })
    .map((path) => {
      const lowered = path.toLowerCase();
      let score = 0;
      for (const hint of priorityHints) {
        if (lowered.includes(hint)) {
          score += 2;
        }
      }
      if (lowered.includes(".test.") || lowered.includes(".spec.")) {
        score += 1;
      }
      if (lowered.endsWith("index.ts") || lowered.endsWith("main.py") || lowered.endsWith("app.ts")) {
        score += 2;
      }
      return { path, score };
    })
    .sort((a, b) => b.score - a.score || a.path.length - b.path.length)
    .slice(0, MAX_DEEP_ANALYSIS_FILES)
    .map((item) => item.path);

  return [...new Set(candidates)];
}

function mapGitHubError(error: unknown): { status: number; message: string } {
  if (error && typeof error === "object" && "status" in error) {
    const status = Number((error as { status?: number }).status) || 500;
    if (status === 404) {
      return { status, message: "Repository not found. Please check the URL." };
    }
    if (status === 401 || status === 403) {
      return {
        status,
        message: "GitHub API access was denied or rate-limited. Try again shortly or set a token.",
      };
    }
    if (status === 409 || status === 422) {
      return {
        status,
        message: "Repository is too large to scan recursively. Try a smaller repo.",
      };
    }
    return { status, message: "GitHub API request failed. Please try again." };
  }

  if (error instanceof Error && /network|socket|ECONN|ENOTFOUND/i.test(error.message)) {
    return {
      status: 502,
      message: "Could not reach GitHub. Check your connection and retry.",
    };
  }

  return { status: 500, message: "Unexpected error occurred while analyzing the repository." };
}

async function fetchTreePaths(
  owner: string,
  repo: string,
  octokit: ReturnType<typeof createGitHubClient>,
): Promise<{ paths: string[]; truncated: boolean }> {
  try {
    const { data: tree } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "true",
    });

    const paths = (tree.tree ?? [])
      .map((item) => item.path)
      .filter(Boolean) as string[];

    return {
      paths: paths.slice(0, MAX_TREE_PATHS),
      truncated: Boolean(tree.truncated) || paths.length > MAX_TREE_PATHS,
    };
  } catch (error) {
    // Fallback: shallow root listing so we can still run a light analysis
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path: "" });
      if (Array.isArray(data)) {
        const paths = data.map((item) => item.path).filter(Boolean) as string[];
        return { paths: paths.slice(0, MAX_TREE_PATHS), truncated: true };
      }
    } catch {
      // ignore and rethrow original error
    }
    throw error;
  }
}

function decodeBase64(content?: string): string {
  if (!content) {
    return "";
  }
  return Buffer.from(content, "base64").toString("utf-8").slice(0, 600);
}

async function getTextFile(
  owner: string,
  repo: string,
  path: string,
  getContent: ReturnType<typeof createGitHubClient>["repos"]["getContent"],
): Promise<string> {
  try {
    const response = await getContent({
      owner,
      repo,
      path,
    });
    if (Array.isArray(response.data) || response.data.type !== "file") {
      return "";
    }
    return Buffer.from(response.data.content, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const parsedBody = requestSchema.safeParse(await request.json());
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request. Expected { repoUrl: string }." },
      { status: 400 },
    );
  }

  const parsedUrl = parseGitHubRepoUrl(parsedBody.data.repoUrl);
  if (!parsedUrl) {
    return NextResponse.json(
      { error: "Please provide a valid GitHub repository URL." },
      { status: 400 },
    );
  }

  const octokit = createGitHubClient();

  try {
    const [{ data: repo }, { data: contributors }, treeFetch, readme] = await Promise.all([
      octokit.repos.get({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
      }),
      octokit.repos.listContributors({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
        per_page: 5,
      }),
      fetchTreePaths(parsedUrl.owner, parsedUrl.repo, octokit),
      octokit.repos.getReadme({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
      }).catch(() => null),
    ]);

    const treePaths = new Set(treeFetch.paths);
    const detectedFiles = DETECTION_FILES.filter((file) => treePaths.has(file));
    const getContent = octokit.repos.getContent.bind(octokit.repos);

    const [packageJsonText, requirementsText, pyprojectText] = await Promise.all([
      getTextFile(parsedUrl.owner, parsedUrl.repo, "package.json", getContent),
      getTextFile(parsedUrl.owner, parsedUrl.repo, "requirements.txt", getContent),
      getTextFile(parsedUrl.owner, parsedUrl.repo, "pyproject.toml", getContent),
    ]);
    const readmeText = decodeBase64(readme?.data.content);

    const mappedContributors: ContributorInsight[] = contributors
      .filter((contributor) => contributor.type !== "Bot")
      .map((contributor) => ({
        login: contributor.login ?? "unknown",
        contributions: contributor.contributions ?? 0,
      }))
      .slice(0, 5);

    const result = buildFullRepositoryAnalysis({
      repo: {
        owner: parsedUrl.owner,
        name: repo.name,
        url: parsedUrl.normalizedUrl,
        description: repo.description ?? "",
      },
      topics: repo.topics ?? [],
      defaultBranch: repo.default_branch ?? "main",
      primaryLanguage: repo.language ?? "",
      treePaths: [...treePaths],
      detectedFiles,
      readmeText,
      packageJsonText,
      requirementsText,
      pyprojectText,
      contributors: mappedContributors,
      activity: {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        lastPush: repo.pushed_at ?? new Date().toISOString(),
      },
    });

    let finalResult = result;
    try {
      const enhanced = await enhanceAnalysisWithGemini({
        analysis: result,
        readmeText,
        treePaths: [...treePaths],
        detectedFiles,
        packageJsonText,
        requirementsText,
        pyprojectText,
      });
      if (enhanced) {
        finalResult = enhanced;
      }
    } catch (geminiError) {
      console.warn("Gemini enhancement skipped", {
        message: geminiError instanceof Error ? geminiError.message : "Unknown Gemini error",
      });
    }

    if (parsedBody.data.deepAnalysis) {
      try {
        const deepPaths = selectDeepAnalysisPaths([...treePaths]);
        const deepSnippetsRaw = await Promise.all(
          deepPaths.map(async (path) => ({
            path,
            content: (await getTextFile(parsedUrl.owner, parsedUrl.repo, path, getContent)).slice(0, MAX_DEEP_FILE_CHARS),
          })),
        );
        const deepSnippets: GeminiCodeSnippet[] = deepSnippetsRaw.filter((snippet) => snippet.content.trim().length > 0);

        if (deepSnippets.length > 0) {
          const deepEnhanced = await enhanceAnalysisWithGeminiDeepCodePass({
            analysis: finalResult,
            codeSnippets: deepSnippets,
          });
          if (deepEnhanced) {
            finalResult = deepEnhanced;
          }
        }
      } catch (deepError) {
        console.warn("Gemini deep code pass skipped", {
          message: deepError instanceof Error ? deepError.message : "Unknown deep-pass error",
        });
      }
    }

    return NextResponse.json(finalResult);
  } catch (error) {
    const mapped = mapGitHubError(error);
    console.error("Repo analysis failed", {
      status: mapped.status,
      message: error instanceof Error ? error.message : "Unknown error",
      raw: error,
    });
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
