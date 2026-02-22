import { Octokit } from "@octokit/rest";

export function createGitHubClient(): Octokit {
  const token = process.env.GITHUB_TOKEN;

  return new Octokit({
    auth: token || undefined,
  });
}

