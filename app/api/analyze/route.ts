import { NextResponse } from "next/server";
import { z } from "zod";

import { buildHeuristicSummary } from "@/lib/analyzers/summary";
import { detectTechStackFromFiles } from "@/lib/analyzers/tech-stack";
import { createGitHubClient } from "@/lib/github/client";
import { parseGitHubRepoUrl } from "@/lib/github/url";
import type { AnalysisResult } from "@/lib/types/analysis";

const requestSchema = z.object({
  repoUrl: z.url(),
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

function decodeReadme(content?: string): string {
  if (!content) {
    return "";
  }
  return Buffer.from(content, "base64").toString("utf-8").slice(0, 600);
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
    const [{ data: repo }, { data: contributors }, { data: tree }] = await Promise.all([
      octokit.repos.get({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
      }),
      octokit.repos.listContributors({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
        per_page: 5,
      }),
      octokit.git.getTree({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
        tree_sha: "HEAD",
        recursive: "true",
      }),
    ]);

    const readme = await octokit.repos
      .getReadme({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
      })
      .catch(() => null);

    const treePaths = new Set(tree.tree.map((item) => item.path).filter(Boolean) as string[]);
    const detectedFiles = DETECTION_FILES.filter((file) => treePaths.has(file));
    const techStack = detectTechStackFromFiles(detectedFiles);

    const summary = buildHeuristicSummary({
      repoName: repo.name,
      repoDescription: repo.description ?? "",
      topics: repo.topics ?? [],
      readmeExcerpt: decodeReadme(readme?.data.content),
    });

    const result: AnalysisResult = {
      repo: {
        owner: parsedUrl.owner,
        name: repo.name,
        url: parsedUrl.normalizedUrl,
        description: repo.description ?? "",
      },
      techStack,
      summary,
      insights: {
        contributors: contributors.map((contributor) => ({
          login: contributor.login,
          contributions: contributor.contributions ?? 0,
        })),
        activity: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          openIssues: repo.open_issues_count,
          lastPush: repo.pushed_at ?? new Date().toISOString(),
        },
      },
      meta: {
        generatedAt: new Date().toISOString(),
        analysisMode: "heuristic",
        confidence: "medium",
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status?: number }).status) || 500
      : 500;
    return NextResponse.json(
      { error: "Unable to analyze this repository right now." },
      { status },
    );
  }
}

