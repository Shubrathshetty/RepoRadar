import type { RepoSummary } from "@/lib/types/analysis";

interface SummaryInput {
  repoName: string;
  repoDescription: string;
  topics: string[];
  readmeExcerpt?: string;
}

function inferUses(topics: string[]): string[] {
  if (topics.length === 0) {
    return [
      "Internal tooling or productivity workflows",
      "Reference implementation for developers",
    ];
  }

  return topics.slice(0, 3).map((topic) => `Projects related to ${topic}`);
}

export function buildHeuristicSummary(input: SummaryInput): RepoSummary {
  const whatItIs =
    input.repoDescription?.trim() ||
    `${input.repoName} is a GitHub project with documented source code and community activity.`;

  const mainFeatures: string[] = [];
  if (input.readmeExcerpt) {
    mainFeatures.push("Documented setup/usage in README");
  }
  if (input.topics.length > 0) {
    mainFeatures.push(`Focused domain tags: ${input.topics.slice(0, 5).join(", ")}`);
  }
  if (mainFeatures.length === 0) {
    mainFeatures.push("Core features require deeper source analysis");
  }

  return {
    whatItIs,
    realWorldUses: inferUses(input.topics),
    mainFeatures,
  };
}

