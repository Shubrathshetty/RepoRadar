"use client";

import { FormEvent, useState } from "react";

import type { AnalysisResult } from "@/lib/types/analysis";

interface ApiError {
  error: string;
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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-slate-700">{result.summary.whatItIs}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Tech Stack</h2>
            <p className="mt-2 text-sm text-slate-700">
              Languages: {result.techStack.languages.join(", ") || "Unknown"}
            </p>
            <p className="text-sm text-slate-700">
              Frameworks: {result.techStack.frameworks.join(", ") || "Unknown"}
            </p>
            <p className="text-sm text-slate-700">
              Tooling: {result.techStack.tooling.join(", ") || "Unknown"}
            </p>
            <p className="text-sm text-slate-700">
              Infrastructure: {result.techStack.infrastructure.join(", ") || "Unknown"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Potential Real-World Uses</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
              {result.summary.realWorldUses.map((useCase) => (
                <li key={useCase}>{useCase}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Main Features</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
              {result.summary.mainFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Contributors and Activity</h2>
            <p className="mt-2 text-sm text-slate-700">
              Stars: {result.insights.activity.stars} | Forks: {result.insights.activity.forks} | Open Issues:{" "}
              {result.insights.activity.openIssues}
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
              {result.insights.contributors.map((contributor) => (
                <li key={contributor.login}>
                  {contributor.login} ({contributor.contributions} contributions)
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

