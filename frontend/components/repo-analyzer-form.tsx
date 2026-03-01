"use client";

import { FormEvent, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import type { AnalysisResult } from "@/backend/types/analysis";
import { StarRating, Button } from "@/frontend/components/ui";

interface ApiError {
  error: string;
}

const DEMO_REPO_URL = "https://github.com/vercel/swr";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-slate-500 dark:text-slate-400">Not detected in current scan.</p>;
  }

  return (
    <ul className="list-inside list-disc space-y-1">
      {items.map((item) => (
        <li key={item} className="text-slate-700 dark:text-slate-300">{item}</li>
      ))}
    </ul>
  );
}

function toSentence(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
}

function ArchitectureFlowDiagram({ result }: { result: AnalysisResult }) {
  const nodes = [
    {
      title: "Input",
      detail: toSentence(
        result.exampleExecutionFlow.input,
        "User or system input enters the repository interface.",
      ),
    },
    {
      title: "Architecture",
      detail: toSentence(
        result.architecture.highLevelArchitecture,
        "Request is routed through the project architecture.",
      ),
    },
    {
      title: "Core Modules",
      detail: toSentence(
        result.architecture.componentsAndInteractions[0] ?? "",
        "Core business modules execute logic and transformations.",
      ),
    },
    {
      title: "Output",
      detail: toSentence(
        result.exampleExecutionFlow.output,
        "System returns output through APIs, files, or UI.",
      ),
    },
  ];

  return (
    <SectionCard title="Architecture & Flow Diagram">
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[780px] flex items-stretch gap-3">
          {nodes.map((node, index) => (
            <div key={node.title} className="flex items-center gap-3">
              <div className="w-44 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400">
                  {node.title}
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{node.detail}</p>
              </div>
              {index < nodes.length - 1 ? (
                <svg
                  className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 12h15"
                  />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <p>
        <strong className="text-slate-900 dark:text-white">Execution flow steps</strong>
      </p>
      <BulletList items={result.architecture.dataFlow} />
    </SectionCard>
  );
}

export function RepoAnalyzerForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deepAnalysisRef = useRef(false);

  useEffect(() => {
    deepAnalysisRef.current = deepAnalysis;
  }, [deepAnalysis]);

  const runAnalysis = useCallback(async (url: string, runDeepAnalysis: boolean) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a repository URL.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    setFeedbackSubmitted(false);
    setUserRating(0);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: trimmedUrl, deepAnalysis: runDeepAnalysis }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiError;
        setError(body.error || "Failed to analyze repository.");
        return;
      }

      const body = (await response.json()) as AnalysisResult;
      setResult(body);
      setRepoUrl(trimmedUrl);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleHashAction = () => {
      const hash = window.location.hash;

      if (hash === "#repo-analyzer" || hash === "#repo-analyzer-demo") {
        const container = document.getElementById("repo-analyzer");
        container?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.select();
        }, 250);
      }

      if (hash === "#repo-analyzer-demo") {
        setRepoUrl(DEMO_REPO_URL);
        void runAnalysis(DEMO_REPO_URL, deepAnalysisRef.current);
      }
    };

    handleHashAction();
    window.addEventListener("hashchange", handleHashAction);
    return () => window.removeEventListener("hashchange", handleHashAction);
  }, [runAnalysis]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAnalysis(repoUrl, deepAnalysis);
  }

  const handleFeedbackSubmit = async () => {
    if (userRating === 0) return;
    
    setSubmittingFeedback(true);
    
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: userRating }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div id="repo-analyzer" className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">RepoRadar</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Paste a public GitHub repository URL to generate a structured technical explanation.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="repo-url">
          GitHub repository URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            id="repo-url"
            type="url"
            required
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-slate-500 focus:outline-none dark:placeholder-slate-400"
            placeholder="https://github.com/vercel/next.js"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 dark:bg-slate-100 px-4 py-2 text-sm font-medium text-white dark:text-slate-900 disabled:opacity-60 transition-colors"
          >
            {loading ? (deepAnalysis ? "Deep Analyzing..." : "Analyzing...") : "Analyze"}
          </button>
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={deepAnalysis}
            onChange={(event) => setDeepAnalysis(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
          />
          Enable deep Gemini module analysis (slower, higher token usage)
        </label>
        {error ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      </form>

      {result ? (
        <section className="space-y-4">
          <SectionCard title="1. Project Overview">
            <p>
              <strong className="text-slate-900 dark:text-white">Purpose:</strong> {result.projectOverview.purpose}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Problem:</strong> {result.projectOverview.problemItSolves}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">How it works:</strong> {result.projectOverview.highLevelHowItWorks}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Target users/use cases:</strong>
            </p>
            <BulletList items={result.projectOverview.targetUsersOrUseCases} />
          </SectionCard>

          <SectionCard title="2. Repository Structure">
            <p>
              <strong className="text-slate-900 dark:text-white">Key folders</strong>
            </p>
            <BulletList items={result.repositoryStructure.keyFolders} />
            <p>
              <strong className="text-slate-900 dark:text-white">Key files</strong>
            </p>
            <BulletList items={result.repositoryStructure.keyFiles} />
            <p>
              <strong className="text-slate-900 dark:text-white">Configuration files</strong>
            </p>
            <BulletList items={result.repositoryStructure.configurationFiles} />
            <p>
              <strong className="text-slate-900 dark:text-white">Entry points</strong>
            </p>
            <BulletList items={result.repositoryStructure.entryPoints} />
          </SectionCard>

          <SectionCard title="3. Tech Stack">
            <p>
              <strong className="text-slate-900 dark:text-white">Languages:</strong> {result.techStack.languages.join(", ") || "Unknown"}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Frameworks/Libraries:</strong> {result.techStack.frameworks.join(", ") || "Unknown"}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Databases:</strong> {result.techStack.databases.join(", ") || "Unknown"}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Tooling:</strong> {result.techStack.tooling.join(", ") || "Unknown"}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Infrastructure:</strong> {result.techStack.infrastructure.join(", ") || "Unknown"}
            </p>
          </SectionCard>

          <SectionCard title="4. How the System Works (Architecture)">
            <p>{result.architecture.highLevelArchitecture}</p>
            <p>
              <strong className="text-slate-900 dark:text-white">Components and interactions</strong>
            </p>
            <BulletList items={result.architecture.componentsAndInteractions} />
            <p>
              <strong className="text-slate-900 dark:text-white">Data flow</strong>
            </p>
            <BulletList items={result.architecture.dataFlow} />
            <p>
              <strong className="text-slate-900 dark:text-white">APIs/services</strong>
            </p>
            <BulletList items={result.architecture.apisOrServices} />
          </SectionCard>

          <ArchitectureFlowDiagram result={result} />

          <SectionCard title="5. Core Modules / Important Code">
            <p>
              <strong className="text-slate-900 dark:text-white">Main classes/functions</strong>
            </p>
            <BulletList items={result.coreModules.mainClassesOrFunctions} />
            <p>
              <strong className="text-slate-900 dark:text-white">Key algorithms</strong>
            </p>
            <BulletList items={result.coreModules.keyAlgorithms} />
            <p>
              <strong className="text-slate-900 dark:text-white">Business logic</strong>
            </p>
            <BulletList items={result.coreModules.businessLogic} />
            <p>
              <strong className="text-slate-900 dark:text-white">Design decisions</strong>
            </p>
            <BulletList items={result.coreModules.importantDesignDecisions} />
          </SectionCard>

          <SectionCard title="6. Setup and Installation">
            <p>
              <strong className="text-slate-900 dark:text-white">Prerequisites</strong>
            </p>
            <BulletList items={result.setupAndInstallation.prerequisites} />
            <p>
              <strong className="text-slate-900 dark:text-white">Install dependencies</strong>
            </p>
            <BulletList items={result.setupAndInstallation.installDependencies} />
            <p>
              <strong className="text-slate-900 dark:text-white">Environment variables</strong>
            </p>
            <BulletList items={result.setupAndInstallation.environmentVariables} />
            <p>
              <strong className="text-slate-900 dark:text-white">Run locally</strong>
            </p>
            <BulletList items={result.setupAndInstallation.runLocally} />
          </SectionCard>

          <SectionCard title="7. Example Execution Flow">
            <p>
              <strong className="text-slate-900 dark:text-white">Input:</strong> {result.exampleExecutionFlow.input}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Internal processing</strong>
            </p>
            <BulletList items={result.exampleExecutionFlow.internalProcessing} />
            <p>
              <strong className="text-slate-900 dark:text-white">Output:</strong> {result.exampleExecutionFlow.output}
            </p>
          </SectionCard>

          <SectionCard title="8. APIs / Interfaces">
            <p>
              <strong className="text-slate-900 dark:text-white">Endpoints</strong>
            </p>
            <BulletList items={result.apiInterfaces.endpoints} />
            <p>
              <strong className="text-slate-900 dark:text-white">Request/response structure</strong>
            </p>
            <BulletList items={result.apiInterfaces.requestResponseStructure} />
            <p>
              <strong className="text-slate-900 dark:text-white">Authentication:</strong> {result.apiInterfaces.authentication}
            </p>
          </SectionCard>

          <SectionCard title="9. Database / Data Models">
            <p>
              <strong className="text-slate-900 dark:text-white">Schema:</strong> {result.databaseAndDataModels.schema}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Relationships</strong>
            </p>
            <BulletList items={result.databaseAndDataModels.relationships} />
            <p>
              <strong className="text-slate-900 dark:text-white">Data lifecycle</strong>
            </p>
            <BulletList items={result.databaseAndDataModels.dataLifecycle} />
          </SectionCard>

          <SectionCard title="10. Testing">
            <p>
              <strong className="text-slate-900 dark:text-white">Frameworks</strong>
            </p>
            <BulletList items={result.testing.testFrameworks} />
            <p>
              <strong className="text-slate-900 dark:text-white">Coverage notes</strong>
            </p>
            <BulletList items={result.testing.coverageNotes} />
            <p>
              <strong className="text-slate-900 dark:text-white">How to run tests</strong>
            </p>
            <BulletList items={result.testing.runTests} />
          </SectionCard>

          <SectionCard title="11. Performance / Scalability">
            <p>
              <strong className="text-slate-900 dark:text-white">Bottlenecks</strong>
            </p>
            <BulletList items={result.performanceAndScalability.bottlenecks} />
            <p>
              <strong className="text-slate-900 dark:text-white">Optimizations</strong>
            </p>
            <BulletList items={result.performanceAndScalability.optimizationTechniques} />
            <p>
              <strong className="text-slate-900 dark:text-white">Concurrency/caching</strong>
            </p>
            <BulletList items={result.performanceAndScalability.concurrencyOrCaching} />
          </SectionCard>

          <SectionCard title="12. Security Considerations">
            <p>
              <strong className="text-slate-900 dark:text-white">Auth systems</strong>
            </p>
            <BulletList items={result.securityConsiderations.authSystems} />
            <p>
              <strong className="text-slate-900 dark:text-white">Input validation</strong>
            </p>
            <BulletList items={result.securityConsiderations.inputValidation} />
            <p>
              <strong className="text-slate-900 dark:text-white">Secrets handling</strong>
            </p>
            <BulletList items={result.securityConsiderations.secretsHandling} />
          </SectionCard>

          <SectionCard title="13. Deployment">
            <p>
              <strong className="text-slate-900 dark:text-white">CI/CD setup</strong>
            </p>
            <BulletList items={result.deployment.ciCdSetup} />
            <p>
              <strong className="text-slate-900 dark:text-white">Containers</strong>
            </p>
            <BulletList items={result.deployment.dockerOrContainers} />
            <p>
              <strong className="text-slate-900 dark:text-white">Cloud platforms</strong>
            </p>
            <BulletList items={result.deployment.cloudPlatforms} />
            <p>
              <strong className="text-slate-900 dark:text-white">Production architecture:</strong> {result.deployment.productionArchitecture}
            </p>
          </SectionCard>

          <SectionCard title="14. Code Quality Review">
            <p>
              <strong className="text-slate-900 dark:text-white">Design patterns</strong>
            </p>
            <BulletList items={result.codeQualityReview.designPatterns} />
            <p>
              <strong className="text-slate-900 dark:text-white">Maintainability</strong>
            </p>
            <BulletList items={result.codeQualityReview.maintainability} />
            <p>
              <strong className="text-slate-900 dark:text-white">Potential issues</strong>
            </p>
            <BulletList items={result.codeQualityReview.potentialIssuesOrBugs} />
            <p>
              <strong className="text-slate-900 dark:text-white">Suggestions</strong>
            </p>
            <BulletList items={result.codeQualityReview.suggestionsForImprovement} />
          </SectionCard>

          <SectionCard title="15. Documentation Quality">
            <p>
              <strong className="text-slate-900 dark:text-white">README completeness:</strong> {result.documentationQuality.readmeCompleteness}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Missing explanations</strong>
            </p>
            <BulletList items={result.documentationQuality.missingExplanations} />
            <p>
              <strong className="text-slate-900 dark:text-white">Onboarding difficulty:</strong> {result.documentationQuality.onboardingDifficulty}
            </p>
          </SectionCard>

          <SectionCard title="16. Real-world Use or Alternatives">
            <p>
              <strong className="text-slate-900 dark:text-white">Comparable projects</strong>
            </p>
            <BulletList items={result.realWorldUseOrAlternatives.comparableProjects} />
            <p>
              <strong className="text-slate-900 dark:text-white">When to use this vs alternatives</strong>
            </p>
            <BulletList items={result.realWorldUseOrAlternatives.whenToUseThisVsSomethingElse} />
          </SectionCard>

          <SectionCard title="17. Quick Summary">
            <p>
              <strong className="text-slate-900 dark:text-white">Strengths</strong>
            </p>
            <BulletList items={result.quickSummary.strengths} />
            <p>
              <strong className="text-slate-900 dark:text-white">Weaknesses</strong>
            </p>
            <BulletList items={result.quickSummary.weaknesses} />
            <p>
              <strong className="text-slate-900 dark:text-white">Overall evaluation:</strong> {result.quickSummary.overallEvaluation}
            </p>
          </SectionCard>

          <SectionCard title="Repository Activity Snapshot">
            <p>
              <strong className="text-slate-900 dark:text-white">Stars:</strong> {result.insights.activity.stars} | <strong className="text-slate-900 dark:text-white">Forks:</strong>{" "}
              {result.insights.activity.forks} | <strong className="text-slate-900 dark:text-white">Open Issues:</strong>{" "}
              {result.insights.activity.openIssues}
            </p>
            <p>
              <strong className="text-slate-900 dark:text-white">Top contributors</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              {result.insights.contributors.map((contributor) => (
                <li key={contributor.login} className="text-slate-700 dark:text-slate-300">
                  {contributor.login} ({contributor.contributions} contributions)
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Feedback Section */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 shadow-sm">
            {!feedbackSubmitted ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    How was this analysis?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your feedback helps us improve RepoRadar
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating
                    rating={userRating}
                    size="lg"
                    interactive
                    onRate={setUserRating}
                  />
                  {userRating > 0 && (
                    <Button
                      size="sm"
                      onClick={handleFeedbackSubmit}
                      disabled={submittingFeedback}
                    >
                      {submittingFeedback ? "..." : "Submit"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Thanks for your feedback!</span>
              </div>
            )}
          </div>

          <section className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/70 bg-gradient-to-r from-emerald-50 via-white to-sky-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-sky-950/30 p-6 shadow-md">
            <div className="mb-4 inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 dark:text-emerald-200">
              Highlighted Insight
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              How RepoRadar Differs from Generic LLM Explanations
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p>{result.differentiator.whatMakesRepoRadarDifferent}</p>
              <p>
                <strong className="text-slate-900 dark:text-white">Evidence ledger</strong>
              </p>
              <ul className="list-inside list-disc space-y-1">
                {result.differentiator.evidenceLedger.map((item, index) => (
                  <li key={`${item.source}-${index}`} className="text-slate-700 dark:text-slate-300">
                    <strong>{item.source}:</strong> {item.signal} ({item.supports})
                  </li>
                ))}
              </ul>
              <p>
                <strong className="text-slate-900 dark:text-white">Confidence rationale:</strong>{" "}
                {result.differentiator.confidenceRationale}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Computed confidence:</strong> {result.meta.confidence}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Analysis mode:</strong> {result.meta.analysisMode}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">Deeper analysis modes</strong>
              </p>
              <BulletList items={result.differentiator.deeperAnalysisOptions} />
            </div>
          </section>
        </section>
      ) : null}
    </div>
  );
}

