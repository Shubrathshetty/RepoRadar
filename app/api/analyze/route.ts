import { NextResponse } from "next/server";
import { z } from "zod";

import { buildFullRepositoryAnalysis } from "@/lib/analyzers/full-report";
import { createGitHubClient } from "@/lib/github/client";
import { parseGitHubRepoUrl } from "@/lib/github/url";
import type { ContributorInsight } from "@/lib/types/analysis";

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
    const [{ data: repo }, { data: contributors }, { data: tree }, readme] = await Promise.all([
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
      octokit.repos.getReadme({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
      }).catch(() => null),
    ]);

    const treePaths = new Set(tree.tree.map((item) => item.path).filter(Boolean) as string[]);
    const detectedFiles = DETECTION_FILES.filter((file) => treePaths.has(file));
    const getContent = octokit.repos.getContent.bind(octokit.repos);

    const [packageJsonText, requirementsText, pyprojectText] = await Promise.all([
      getTextFile(parsedUrl.owner, parsedUrl.repo, "package.json", getContent),
      getTextFile(parsedUrl.owner, parsedUrl.repo, "requirements.txt", getContent),
      getTextFile(parsedUrl.owner, parsedUrl.repo, "pyproject.toml", getContent),
    ]);

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
      readmeText: decodeBase64(readme?.data.content),
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

    return NextResponse.json(result);
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status?: number }).status) || 500
      : 500;
    console.error("Repo analysis failed", {
      status,
      message: error instanceof Error ? error.message : "Unknown error",
      raw: error,
    });
    return NextResponse.json(
      { error: "Unable to analyze this repository right now." },
      { status },
    );
  }
}
