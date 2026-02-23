"use client";

import { FormEvent, useState, type ReactNode } from "react";

import type { AnalysisResult } from "@/lib/types/analysis";

interface ApiError {
  error: string;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p>Not detected in current scan.</p>;
  }

  return (
    <ul className="list-inside list-disc space-y-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function RepoAnalyzerForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiError;
        setError(body.error || "Failed to analyze repository.");
        return;
      }

      const body = (await response.json()) as AnalysisResult;
      setResult(body);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">RepoRadar</h1>
        <p className="mt-2 text-sm text-slate-600">
          Paste a public GitHub repository URL to generate a structured technical explanation.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="repo-url">
          GitHub repository URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="repo-url"
            type="url"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            placeholder="https://github.com/vercel/next.js"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </form>

      {result ? (
        <section className="space-y-4">
          <SectionCard title="1. Project Overview">
            <p>
              <strong>Purpose:</strong> {result.projectOverview.purpose}
            </p>
            <p>
              <strong>Problem:</strong> {result.projectOverview.problemItSolves}
            </p>
            <p>
              <strong>How it works:</strong> {result.projectOverview.highLevelHowItWorks}
            </p>
            <p>
              <strong>Target users/use cases:</strong>
            </p>
            <BulletList items={result.projectOverview.targetUsersOrUseCases} />
          </SectionCard>

          <SectionCard title="2. Repository Structure">
            <p>
              <strong>Key folders</strong>
            </p>
            <BulletList items={result.repositoryStructure.keyFolders} />
            <p>
              <strong>Key files</strong>
            </p>
            <BulletList items={result.repositoryStructure.keyFiles} />
            <p>
              <strong>Configuration files</strong>
            </p>
            <BulletList items={result.repositoryStructure.configurationFiles} />
            <p>
              <strong>Entry points</strong>
            </p>
            <BulletList items={result.repositoryStructure.entryPoints} />
          </SectionCard>

          <SectionCard title="3. Tech Stack">
            <p>
              <strong>Languages:</strong> {result.techStack.languages.join(", ") || "Unknown"}
            </p>
            <p>
              <strong>Frameworks/Libraries:</strong> {result.techStack.frameworks.join(", ") || "Unknown"}
            </p>
            <p>
              <strong>Databases:</strong> {result.techStack.databases.join(", ") || "Unknown"}
            </p>
            <p>
              <strong>Tooling:</strong> {result.techStack.tooling.join(", ") || "Unknown"}
            </p>
            <p>
              <strong>Infrastructure:</strong> {result.techStack.infrastructure.join(", ") || "Unknown"}
            </p>
          </SectionCard>

          <SectionCard title="4. How the System Works (Architecture)">
            <p>{result.architecture.highLevelArchitecture}</p>
            <p>
              <strong>Components and interactions</strong>
            </p>
            <BulletList items={result.architecture.componentsAndInteractions} />
            <p>
              <strong>Data flow</strong>
            </p>
            <BulletList items={result.architecture.dataFlow} />
            <p>
              <strong>APIs/services</strong>
            </p>
            <BulletList items={result.architecture.apisOrServices} />
          </SectionCard>

          <SectionCard title="5. Core Modules / Important Code">
            <p>
              <strong>Main classes/functions</strong>
            </p>
            <BulletList items={result.coreModules.mainClassesOrFunctions} />
            <p>
              <strong>Key algorithms</strong>
            </p>
            <BulletList items={result.coreModules.keyAlgorithms} />
            <p>
              <strong>Business logic</strong>
            </p>
            <BulletList items={result.coreModules.businessLogic} />
            <p>
              <strong>Design decisions</strong>
            </p>
            <BulletList items={result.coreModules.importantDesignDecisions} />
          </SectionCard>

          <SectionCard title="6. Setup and Installation">
            <p>
              <strong>Prerequisites</strong>
            </p>
            <BulletList items={result.setupAndInstallation.prerequisites} />
            <p>
              <strong>Install dependencies</strong>
            </p>
            <BulletList items={result.setupAndInstallation.installDependencies} />
            <p>
              <strong>Environment variables</strong>
            </p>
            <BulletList items={result.setupAndInstallation.environmentVariables} />
            <p>
              <strong>Run locally</strong>
            </p>
            <BulletList items={result.setupAndInstallation.runLocally} />
          </SectionCard>

          <SectionCard title="7. Example Execution Flow">
            <p>
              <strong>Input:</strong> {result.exampleExecutionFlow.input}
            </p>
            <p>
              <strong>Internal processing</strong>
            </p>
            <BulletList items={result.exampleExecutionFlow.internalProcessing} />
            <p>
              <strong>Output:</strong> {result.exampleExecutionFlow.output}
            </p>
          </SectionCard>

          <SectionCard title="8. APIs / Interfaces">
            <p>
              <strong>Endpoints</strong>
            </p>
            <BulletList items={result.apiInterfaces.endpoints} />
            <p>
              <strong>Request/response structure</strong>
            </p>
            <BulletList items={result.apiInterfaces.requestResponseStructure} />
            <p>
              <strong>Authentication:</strong> {result.apiInterfaces.authentication}
            </p>
          </SectionCard>

          <SectionCard title="9. Database / Data Models">
            <p>
              <strong>Schema:</strong> {result.databaseAndDataModels.schema}
            </p>
            <p>
              <strong>Relationships</strong>
            </p>
            <BulletList items={result.databaseAndDataModels.relationships} />
            <p>
              <strong>Data lifecycle</strong>
            </p>
            <BulletList items={result.databaseAndDataModels.dataLifecycle} />
          </SectionCard>

          <SectionCard title="10. Testing">
            <p>
              <strong>Frameworks</strong>
            </p>
            <BulletList items={result.testing.testFrameworks} />
            <p>
              <strong>Coverage notes</strong>
            </p>
            <BulletList items={result.testing.coverageNotes} />
            <p>
              <strong>How to run tests</strong>
            </p>
            <BulletList items={result.testing.runTests} />
          </SectionCard>

          <SectionCard title="11. Performance / Scalability">
            <p>
              <strong>Bottlenecks</strong>
            </p>
            <BulletList items={result.performanceAndScalability.bottlenecks} />
            <p>
              <strong>Optimizations</strong>
            </p>
            <BulletList items={result.performanceAndScalability.optimizationTechniques} />
            <p>
              <strong>Concurrency/caching</strong>
            </p>
            <BulletList items={result.performanceAndScalability.concurrencyOrCaching} />
          </SectionCard>

          <SectionCard title="12. Security Considerations">
            <p>
              <strong>Auth systems</strong>
            </p>
            <BulletList items={result.securityConsiderations.authSystems} />
            <p>
              <strong>Input validation</strong>
            </p>
            <BulletList items={result.securityConsiderations.inputValidation} />
            <p>
              <strong>Secrets handling</strong>
            </p>
            <BulletList items={result.securityConsiderations.secretsHandling} />
          </SectionCard>

          <SectionCard title="13. Deployment">
            <p>
              <strong>CI/CD setup</strong>
            </p>
            <BulletList items={result.deployment.ciCdSetup} />
            <p>
              <strong>Containers</strong>
            </p>
            <BulletList items={result.deployment.dockerOrContainers} />
            <p>
              <strong>Cloud platforms</strong>
            </p>
            <BulletList items={result.deployment.cloudPlatforms} />
            <p>
              <strong>Production architecture:</strong> {result.deployment.productionArchitecture}
            </p>
          </SectionCard>

          <SectionCard title="14. Code Quality Review">
            <p>
              <strong>Design patterns</strong>
            </p>
            <BulletList items={result.codeQualityReview.designPatterns} />
            <p>
              <strong>Maintainability</strong>
            </p>
            <BulletList items={result.codeQualityReview.maintainability} />
            <p>
              <strong>Potential issues</strong>
            </p>
            <BulletList items={result.codeQualityReview.potentialIssuesOrBugs} />
            <p>
              <strong>Suggestions</strong>
            </p>
            <BulletList items={result.codeQualityReview.suggestionsForImprovement} />
          </SectionCard>

          <SectionCard title="15. Documentation Quality">
            <p>
              <strong>README completeness:</strong> {result.documentationQuality.readmeCompleteness}
            </p>
            <p>
              <strong>Missing explanations</strong>
            </p>
            <BulletList items={result.documentationQuality.missingExplanations} />
            <p>
              <strong>Onboarding difficulty:</strong> {result.documentationQuality.onboardingDifficulty}
            </p>
          </SectionCard>

          <SectionCard title="16. Real-world Use or Alternatives">
            <p>
              <strong>Comparable projects</strong>
            </p>
            <BulletList items={result.realWorldUseOrAlternatives.comparableProjects} />
            <p>
              <strong>When to use this vs alternatives</strong>
            </p>
            <BulletList items={result.realWorldUseOrAlternatives.whenToUseThisVsSomethingElse} />
          </SectionCard>

          <SectionCard title="17. Quick Summary">
            <p>
              <strong>Strengths</strong>
            </p>
            <BulletList items={result.quickSummary.strengths} />
            <p>
              <strong>Weaknesses</strong>
            </p>
            <BulletList items={result.quickSummary.weaknesses} />
            <p>
              <strong>Overall evaluation:</strong> {result.quickSummary.overallEvaluation}
            </p>
          </SectionCard>

          <SectionCard title="How RepoRadar Differs from Generic LLM Explanations">
            <p>{result.differentiator.whatMakesRepoRadarDifferent}</p>
            <p>
              <strong>Evidence ledger</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              {result.differentiator.evidenceLedger.map((item, index) => (
                <li key={`${item.source}-${index}`}>
                  <strong>{item.source}:</strong> {item.signal} ({item.supports})
                </li>
              ))}
            </ul>
            <p>
              <strong>Confidence rationale:</strong> {result.differentiator.confidenceRationale}
            </p>
            <p>
              <strong>Computed confidence:</strong> {result.meta.confidence}
            </p>
            <p>
              <strong>Deeper analysis modes</strong>
            </p>
            <BulletList items={result.differentiator.deeperAnalysisOptions} />
          </SectionCard>

          <SectionCard title="Repository Activity Snapshot">
            <p>
              Stars: {result.insights.activity.stars} | Forks: {result.insights.activity.forks} | Open Issues:{" "}
              {result.insights.activity.openIssues}
            </p>
            <p>
              <strong>Top contributors</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              {result.insights.contributors.map((contributor) => (
                <li key={contributor.login}>
                  {contributor.login} ({contributor.contributions} contributions)
                </li>
              ))}
            </ul>
          </SectionCard>
        </section>
      ) : null}
    </div>
  );
}
