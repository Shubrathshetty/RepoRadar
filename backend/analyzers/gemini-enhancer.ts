import { z } from "zod";

import type { AnalysisResult } from "@/backend/types/analysis";

const geminiResponseSchema = z.object({
  summary: z.object({
    whatItIs: z.string().min(1).max(600),
    realWorldUses: z.array(z.string().min(1).max(240)).min(1).max(6),
    mainFeatures: z.array(z.string().min(1).max(240)).min(1).max(8),
  }).optional(),
  projectOverview: z.object({
    purpose: z.string().min(1).max(500),
    problemItSolves: z.string().min(1).max(500),
    targetUsersOrUseCases: z.array(z.string().min(1).max(220)).min(1).max(8),
    highLevelHowItWorks: z.string().min(1).max(700),
  }).optional(),
  architecture: z.object({
    highLevelArchitecture: z.string().min(1).max(700),
    componentsAndInteractions: z.array(z.string().min(1).max(260)).min(1).max(8),
    dataFlow: z.array(z.string().min(1).max(260)).min(1).max(8),
    apisOrServices: z.array(z.string().min(1).max(260)).min(1).max(8),
  }).optional(),
  coreModules: z.object({
    mainClassesOrFunctions: z.array(z.string().min(1).max(260)).min(1).max(10),
    keyAlgorithms: z.array(z.string().min(1).max(260)).min(1).max(8),
    businessLogic: z.array(z.string().min(1).max(260)).min(1).max(8),
    importantDesignDecisions: z.array(z.string().min(1).max(260)).min(1).max(8),
  }).optional(),
  exampleExecutionFlow: z.object({
    input: z.string().min(1).max(420),
    internalProcessing: z.array(z.string().min(1).max(260)).min(1).max(8),
    output: z.string().min(1).max(420),
  }).optional(),
  quickSummary: z.object({
    strengths: z.array(z.string().min(1).max(220)).min(1).max(8),
    weaknesses: z.array(z.string().min(1).max(220)).min(1).max(8),
    overallEvaluation: z.string().min(1).max(500),
  }).optional(),
  codeQualityReview: z.object({
    designPatterns: z.array(z.string().min(1).max(220)).min(1).max(8),
    maintainability: z.array(z.string().min(1).max(220)).min(1).max(8),
    potentialIssuesOrBugs: z.array(z.string().min(1).max(220)).min(1).max(8),
    suggestionsForImprovement: z.array(z.string().min(1).max(220)).min(1).max(8),
  }).optional(),
  testing: z.object({
    testFrameworks: z.array(z.string().min(1).max(220)).min(1).max(8),
    coverageNotes: z.array(z.string().min(1).max(220)).min(1).max(8),
    runTests: z.array(z.string().min(1).max(220)).min(1).max(8),
  }).optional(),
  differentiator: z.object({
    confidenceRationale: z.string().min(1).max(500),
  }).optional(),
});

const geminiDeepCodeSchema = z.object({
  architecture: z.object({
    highLevelArchitecture: z.string().min(1).max(700),
    componentsAndInteractions: z.array(z.string().min(1).max(260)).min(1).max(10),
    dataFlow: z.array(z.string().min(1).max(260)).min(1).max(10),
    apisOrServices: z.array(z.string().min(1).max(260)).min(1).max(10),
  }).optional(),
  coreModules: z.object({
    mainClassesOrFunctions: z.array(z.string().min(1).max(260)).min(1).max(12),
    keyAlgorithms: z.array(z.string().min(1).max(260)).min(1).max(10),
    businessLogic: z.array(z.string().min(1).max(260)).min(1).max(10),
    importantDesignDecisions: z.array(z.string().min(1).max(260)).min(1).max(10),
  }).optional(),
  exampleExecutionFlow: z.object({
    input: z.string().min(1).max(420),
    internalProcessing: z.array(z.string().min(1).max(260)).min(1).max(10),
    output: z.string().min(1).max(420),
  }).optional(),
  codeQualityReview: z.object({
    designPatterns: z.array(z.string().min(1).max(220)).min(1).max(10),
    maintainability: z.array(z.string().min(1).max(220)).min(1).max(10),
    potentialIssuesOrBugs: z.array(z.string().min(1).max(220)).min(1).max(10),
    suggestionsForImprovement: z.array(z.string().min(1).max(220)).min(1).max(10),
  }).optional(),
  testing: z.object({
    testFrameworks: z.array(z.string().min(1).max(220)).min(1).max(8),
    coverageNotes: z.array(z.string().min(1).max(220)).min(1).max(8),
    runTests: z.array(z.string().min(1).max(220)).min(1).max(8),
  }).optional(),
  quickSummary: z.object({
    strengths: z.array(z.string().min(1).max(220)).min(1).max(10),
    weaknesses: z.array(z.string().min(1).max(220)).min(1).max(10),
    overallEvaluation: z.string().min(1).max(500),
  }).optional(),
  differentiator: z.object({
    confidenceRationale: z.string().min(1).max(500),
  }).optional(),
});

interface GeminiEnhancerInput {
  analysis: AnalysisResult;
  readmeText: string;
  treePaths: string[];
  detectedFiles: string[];
  packageJsonText: string;
  requirementsText: string;
  pyprojectText: string;
}

export interface GeminiCodeSnippet {
  path: string;
  content: string;
}

interface GeminiDeepCodeInput {
  analysis: AnalysisResult;
  codeSnippets: GeminiCodeSnippet[];
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    return trimmed.slice(first, last + 1);
  }

  throw new Error("Gemini response did not contain JSON.");
}

function uniqueTrimmed(values: string[], max: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }
    if (seen.has(normalized.toLowerCase())) {
      continue;
    }
    seen.add(normalized.toLowerCase());
    result.push(normalized);
    if (result.length >= max) {
      break;
    }
  }

  return result;
}

function pickString(candidate: string | undefined, fallback: string): string {
  const trimmed = candidate?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function pickArray(candidate: string[] | undefined, fallback: string[], max = 8): string[] {
  if (!candidate || candidate.length === 0) {
    return fallback;
  }
  const normalized = uniqueTrimmed(candidate, max);
  return normalized.length > 0 ? normalized : fallback;
}

async function requestGeminiJson(prompt: string): Promise<unknown | null> {
  const apiKey =
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_AI_API_KEY ??
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${bodyText.slice(0, 280)}`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const candidateText = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("\n")
    .trim();

  if (!candidateText) {
    throw new Error("Gemini returned empty content.");
  }

  return JSON.parse(extractJson(candidateText));
}

function buildPrompt(input: GeminiEnhancerInput): string {
  const readmeExcerpt = input.readmeText.slice(0, 4000);
  const packageJsonExcerpt = input.packageJsonText.slice(0, 3000);
  const requirementsExcerpt = input.requirementsText.slice(0, 1200);
  const pyprojectExcerpt = input.pyprojectText.slice(0, 1200);

  const context = {
    repo: input.analysis.repo,
    techStack: input.analysis.techStack,
    detectedFiles: input.detectedFiles,
    treePathsSample: input.treePaths.slice(0, 220),
    heuristicSections: {
      summary: input.analysis.summary,
      projectOverview: input.analysis.projectOverview,
      architecture: input.analysis.architecture,
      coreModules: input.analysis.coreModules,
      exampleExecutionFlow: input.analysis.exampleExecutionFlow,
      codeQualityReview: input.analysis.codeQualityReview,
      quickSummary: input.analysis.quickSummary,
      setupAndInstallation: input.analysis.setupAndInstallation,
      apiInterfaces: input.analysis.apiInterfaces,
      documentationQuality: input.analysis.documentationQuality,
      testing: input.analysis.testing,
      deployment: input.analysis.deployment,
    },
    readmeExcerpt,
    packageJsonExcerpt,
    requirementsExcerpt,
    pyprojectExcerpt,
  };

  return `
You are refining a deterministic repository analysis with stronger architecture and system-flow explanations.
Rules:
1) Return JSON only, with no markdown.
2) Do not invent facts that are not supported by the context.
3) Keep sentences concise and specific.
4) If uncertain, state uncertainty in the relevant bullet.
5) Preserve practical engineering tone.

Return exactly this JSON shape (all keys optional, but include as many as you can improve):
{
  "summary": {
    "whatItIs": "string",
    "realWorldUses": ["string"],
    "mainFeatures": ["string"]
  },
  "projectOverview": {
    "purpose": "string",
    "problemItSolves": "string",
    "targetUsersOrUseCases": ["string"],
    "highLevelHowItWorks": "string"
  },
  "architecture": {
    "highLevelArchitecture": "string",
    "componentsAndInteractions": ["string"],
    "dataFlow": ["string"],
    "apisOrServices": ["string"]
  },
  "coreModules": {
    "mainClassesOrFunctions": ["string"],
    "keyAlgorithms": ["string"],
    "businessLogic": ["string"],
    "importantDesignDecisions": ["string"]
  },
  "exampleExecutionFlow": {
    "input": "string",
    "internalProcessing": ["string"],
    "output": "string"
  },
  "quickSummary": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "overallEvaluation": "string"
  },
  "codeQualityReview": {
    "designPatterns": ["string"],
    "maintainability": ["string"],
    "potentialIssuesOrBugs": ["string"],
    "suggestionsForImprovement": ["string"]
  },
  "differentiator": {
    "confidenceRationale": "string"
  }
}

Repository context:
${JSON.stringify(context)}
`.trim();
}

function buildDeepCodePrompt(input: GeminiDeepCodeInput): string {
  const snippetPayload = input.codeSnippets.slice(0, 8).map((snippet) => ({
    path: snippet.path,
    content: snippet.content.slice(0, 2800),
  }));

  const context = {
    repo: input.analysis.repo,
    techStack: input.analysis.techStack,
    architecture: input.analysis.architecture,
    coreModules: input.analysis.coreModules,
    exampleExecutionFlow: input.analysis.exampleExecutionFlow,
    codeQualityReview: input.analysis.codeQualityReview,
    testing: input.analysis.testing,
    fileSnippets: snippetPayload,
  };

  return `
You are performing a second-pass deep code review on repository snippets.
Goals:
1) Extract module/function-level architecture and execution behavior.
2) Improve algorithm, design, and code-quality observations.
3) Keep claims grounded in provided snippets; if uncertain, mark as likely.

Output JSON only (no markdown), in this shape:
{
  "architecture": {
    "highLevelArchitecture": "string",
    "componentsAndInteractions": ["string"],
    "dataFlow": ["string"],
    "apisOrServices": ["string"]
  },
  "coreModules": {
    "mainClassesOrFunctions": ["string"],
    "keyAlgorithms": ["string"],
    "businessLogic": ["string"],
    "importantDesignDecisions": ["string"]
  },
  "exampleExecutionFlow": {
    "input": "string",
    "internalProcessing": ["string"],
    "output": "string"
  },
  "codeQualityReview": {
    "designPatterns": ["string"],
    "maintainability": ["string"],
    "potentialIssuesOrBugs": ["string"],
    "suggestionsForImprovement": ["string"]
  },
  "testing": {
    "testFrameworks": ["string"],
    "coverageNotes": ["string"],
    "runTests": ["string"]
  },
  "quickSummary": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "overallEvaluation": "string"
  },
  "differentiator": {
    "confidenceRationale": "string"
  }
}

Code review context:
${JSON.stringify(context)}
`.trim();
}

function mergeEnhancedSections(
  base: AnalysisResult,
  enhanced: z.infer<typeof geminiResponseSchema>,
): AnalysisResult {
  const merged = JSON.parse(JSON.stringify(base)) as AnalysisResult;

  if (enhanced.summary) {
    merged.summary = {
      whatItIs: pickString(enhanced.summary.whatItIs, merged.summary.whatItIs),
      realWorldUses: pickArray(enhanced.summary.realWorldUses, merged.summary.realWorldUses, 6),
      mainFeatures: pickArray(enhanced.summary.mainFeatures, merged.summary.mainFeatures, 8),
    };
  }

  if (enhanced.projectOverview) {
    merged.projectOverview = {
      purpose: pickString(enhanced.projectOverview.purpose, merged.projectOverview.purpose),
      problemItSolves: pickString(
        enhanced.projectOverview.problemItSolves,
        merged.projectOverview.problemItSolves,
      ),
      targetUsersOrUseCases: pickArray(
        enhanced.projectOverview.targetUsersOrUseCases,
        merged.projectOverview.targetUsersOrUseCases,
        8,
      ),
      highLevelHowItWorks: pickString(
        enhanced.projectOverview.highLevelHowItWorks,
        merged.projectOverview.highLevelHowItWorks,
      ),
    };
  }

  if (enhanced.architecture) {
    merged.architecture = {
      highLevelArchitecture: pickString(
        enhanced.architecture.highLevelArchitecture,
        merged.architecture.highLevelArchitecture,
      ),
      componentsAndInteractions: pickArray(
        enhanced.architecture.componentsAndInteractions,
        merged.architecture.componentsAndInteractions,
        8,
      ),
      dataFlow: pickArray(enhanced.architecture.dataFlow, merged.architecture.dataFlow, 8),
      apisOrServices: pickArray(enhanced.architecture.apisOrServices, merged.architecture.apisOrServices, 8),
    };
  }

  if (enhanced.coreModules) {
    merged.coreModules = {
      mainClassesOrFunctions: pickArray(
        enhanced.coreModules.mainClassesOrFunctions,
        merged.coreModules.mainClassesOrFunctions,
        10,
      ),
      keyAlgorithms: pickArray(enhanced.coreModules.keyAlgorithms, merged.coreModules.keyAlgorithms, 8),
      businessLogic: pickArray(enhanced.coreModules.businessLogic, merged.coreModules.businessLogic, 8),
      importantDesignDecisions: pickArray(
        enhanced.coreModules.importantDesignDecisions,
        merged.coreModules.importantDesignDecisions,
        8,
      ),
    };
  }

  if (enhanced.exampleExecutionFlow) {
    merged.exampleExecutionFlow = {
      input: pickString(enhanced.exampleExecutionFlow.input, merged.exampleExecutionFlow.input),
      internalProcessing: pickArray(
        enhanced.exampleExecutionFlow.internalProcessing,
        merged.exampleExecutionFlow.internalProcessing,
        8,
      ),
      output: pickString(enhanced.exampleExecutionFlow.output, merged.exampleExecutionFlow.output),
    };
  }

  if (enhanced.quickSummary) {
    merged.quickSummary = {
      strengths: pickArray(enhanced.quickSummary.strengths, merged.quickSummary.strengths, 8),
      weaknesses: pickArray(enhanced.quickSummary.weaknesses, merged.quickSummary.weaknesses, 8),
      overallEvaluation: pickString(
        enhanced.quickSummary.overallEvaluation,
        merged.quickSummary.overallEvaluation,
      ),
    };
  }

  if (enhanced.codeQualityReview) {
    merged.codeQualityReview = {
      designPatterns: pickArray(enhanced.codeQualityReview.designPatterns, merged.codeQualityReview.designPatterns, 8),
      maintainability: pickArray(enhanced.codeQualityReview.maintainability, merged.codeQualityReview.maintainability, 8),
      potentialIssuesOrBugs: pickArray(
        enhanced.codeQualityReview.potentialIssuesOrBugs,
        merged.codeQualityReview.potentialIssuesOrBugs,
        8,
      ),
      suggestionsForImprovement: pickArray(
        enhanced.codeQualityReview.suggestionsForImprovement,
        merged.codeQualityReview.suggestionsForImprovement,
        8,
      ),
    };
  }

  if (enhanced.testing) {
    merged.testing = {
      testFrameworks: pickArray(enhanced.testing.testFrameworks, merged.testing.testFrameworks, 8),
      coverageNotes: pickArray(enhanced.testing.coverageNotes, merged.testing.coverageNotes, 8),
      runTests: pickArray(enhanced.testing.runTests, merged.testing.runTests, 8),
    };
  }

  if (enhanced.differentiator?.confidenceRationale) {
    merged.differentiator.confidenceRationale = pickString(
      enhanced.differentiator.confidenceRationale,
      merged.differentiator.confidenceRationale,
    );
  }

  merged.meta.analysisMode = "ai-assisted";
  if (!merged.differentiator.evidenceLedger.some((item) => item.source === "Gemini enhancement")) {
    merged.differentiator.evidenceLedger.push({
      source: "Gemini enhancement",
      signal: "Narrative sections refined with Gemini using repository evidence and heuristic context.",
      supports: "Architecture, flow clarity, and explanation quality",
    });
  }

  return merged;
}

export async function enhanceAnalysisWithGemini(
  input: GeminiEnhancerInput,
): Promise<AnalysisResult | null> {
  const parsedJson = await requestGeminiJson(buildPrompt(input));
  if (!parsedJson) {
    return null;
  }
  const parsed = geminiResponseSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error("Gemini returned JSON that did not match expected schema.");
  }

  return mergeEnhancedSections(input.analysis, parsed.data);
}

export async function enhanceAnalysisWithGeminiDeepCodePass(
  input: GeminiDeepCodeInput,
): Promise<AnalysisResult | null> {
  const snippets = input.codeSnippets
    .map((snippet) => ({
      path: snippet.path.trim(),
      content: snippet.content.trim(),
    }))
    .filter((snippet) => snippet.path && snippet.content)
    .slice(0, 8);

  if (snippets.length === 0) {
    return null;
  }

  const parsedJson = await requestGeminiJson(
    buildDeepCodePrompt({ analysis: input.analysis, codeSnippets: snippets }),
  );
  if (!parsedJson) {
    return null;
  }

  const parsed = geminiDeepCodeSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error("Gemini deep code pass returned invalid JSON.");
  }

  const merged = mergeEnhancedSections(
    input.analysis,
    parsed.data as z.infer<typeof geminiResponseSchema>,
  );

  if (!merged.differentiator.evidenceLedger.some((item) => item.source === "Gemini deep code pass")) {
    merged.differentiator.evidenceLedger.push({
      source: "Gemini deep code pass",
      signal: `${snippets.length} source files sampled for module-level reasoning.`,
      supports: "Core modules, architecture flow, and code quality insights",
    });
  }

  return merged;
}
