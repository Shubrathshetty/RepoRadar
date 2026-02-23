import { detectTechStackFromFiles } from "@/lib/analyzers/tech-stack";
import type {
  AnalysisResult,
  Confidence,
  ContributorInsight,
  EvidenceItem,
  RepoInfo,
  TechStack,
} from "@/lib/types/analysis";

interface BuildAnalysisInput {
  repo: RepoInfo;
  topics: string[];
  defaultBranch: string;
  primaryLanguage: string;
  treePaths: string[];
  detectedFiles: string[];
  readmeText: string;
  packageJsonText: string;
  requirementsText: string;
  pyprojectText: string;
  contributors: ContributorInsight[];
  activity: AnalysisResult["insights"]["activity"];
}

const FRAMEWORK_KEYWORDS: Record<string, string> = {
  next: "Next.js",
  react: "React",
  vue: "Vue",
  nuxt: "Nuxt",
  express: "Express",
  nest: "NestJS",
  fastapi: "FastAPI",
  django: "Django",
  flask: "Flask",
  spring: "Spring",
};

const DATABASE_KEYWORDS: Record<string, string> = {
  prisma: "Prisma",
  mongoose: "MongoDB (Mongoose)",
  mongodb: "MongoDB",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  sqlite: "SQLite",
  redis: "Redis",
  typeorm: "TypeORM",
  sequelize: "Sequelize",
  drizzle: "Drizzle ORM",
  supabase: "Supabase",
};

const TEST_KEYWORDS: Record<string, string> = {
  jest: "Jest",
  vitest: "Vitest",
  mocha: "Mocha",
  chai: "Chai",
  cypress: "Cypress",
  playwright: "Playwright",
  pytest: "pytest",
};

const AUTH_KEYWORDS: Record<string, string> = {
  "next-auth": "NextAuth/Auth.js",
  passport: "Passport",
  jwt: "JWT-based auth",
  auth0: "Auth0",
  clerk: "Clerk",
};

function toSet(values: string[]): Set<string> {
  return new Set(values.filter(Boolean));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function includesAny(haystack: string, candidates: string[]): boolean {
  const lowered = haystack.toLowerCase();
  return candidates.some((candidate) => lowered.includes(candidate.toLowerCase()));
}

function parsePackageDependencies(packageJsonText: string): string[] {
  if (!packageJsonText) {
    return [];
  }

  try {
    const parsed = JSON.parse(packageJsonText) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      scripts?: Record<string, string>;
    };

    const dependencies = Object.keys(parsed.dependencies ?? {});
    const devDependencies = Object.keys(parsed.devDependencies ?? {});
    const scripts = Object.keys(parsed.scripts ?? {}).map((script) => `script:${script}`);
    return unique([...dependencies, ...devDependencies, ...scripts]);
  } catch {
    return [];
  }
}

function extractPythonPackages(requirementsText: string, pyprojectText: string): string[] {
  const fromRequirements = requirementsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/[=<>!~]/)[0].trim().toLowerCase());

  const fromPyproject = (pyprojectText.match(/^[a-zA-Z0-9._-]+\s*=/gm) ?? [])
    .map((line) => line.split("=")[0].trim().toLowerCase())
    .filter((pkg) => pkg !== "name" && pkg !== "version" && pkg !== "description");

  return unique([...fromRequirements, ...fromPyproject]);
}

function inferFromKeywords(packages: string[], map: Record<string, string>): string[] {
  const hits: string[] = [];
  for (const pkg of packages) {
    const lowered = pkg.toLowerCase();
    for (const [keyword, label] of Object.entries(map)) {
      if (lowered.includes(keyword)) {
        hits.push(label);
      }
    }
  }
  return unique(hits);
}

function detectRepositoryStructure(treePaths: string[]) {
  const firstLevel = unique(
    treePaths
      .map((path) => path.split("/")[0])
      .filter((segment) => segment && !segment.includes(".")),
  );

  const preferredFolders = ["src", "app", "lib", "docs", "tests", "test", "__tests__", ".github", "scripts"];
  const keyFolders = preferredFolders.filter((folder) => firstLevel.includes(folder));

  const keyFiles = treePaths
    .filter((path) =>
      [
        "README.md",
        "README.MD",
        "LICENSE",
        "CONTRIBUTING.md",
        "package.json",
        "requirements.txt",
        "pyproject.toml",
        "Dockerfile",
      ].includes(path),
    )
    .slice(0, 10);

  const configurationFiles = treePaths
    .filter((path) =>
      [
        "package.json",
        "tsconfig.json",
        "next.config.js",
        "next.config.ts",
        "requirements.txt",
        "pyproject.toml",
        "Dockerfile",
        "docker-compose.yml",
        "docker-compose.yaml",
        "vercel.json",
      ].includes(path),
    )
    .slice(0, 12);

  const entryPoints = treePaths
    .filter((path) =>
      [
        "main.py",
        "app.py",
        "server.py",
        "index.js",
        "index.ts",
        "app.js",
        "app.ts",
        "src/index.ts",
        "src/index.js",
        "src/main.ts",
        "src/main.py",
        "cmd/main.go",
      ].includes(path),
    )
    .slice(0, 8);

  return {
    keyFolders: keyFolders.length > 0 ? keyFolders : firstLevel.slice(0, 8),
    keyFiles,
    configurationFiles,
    entryPoints,
  };
}

function detectReadmeQuality(readmeText: string): {
  completeness: string;
  missing: string[];
  onboardingDifficulty: string;
} {
  if (!readmeText) {
    return {
      completeness: "README not detected through API or is empty.",
      missing: [
        "Project overview",
        "Setup steps",
        "Configuration/environment variables",
        "Testing instructions",
      ],
      onboardingDifficulty: "high",
    };
  }

  const lowered = readmeText.toLowerCase();
  const hasInstallation = includesAny(lowered, ["install", "setup"]);
  const hasUsage = includesAny(lowered, ["usage", "run", "getting started", "quickstart"]);
  const hasEnv = includesAny(lowered, ["environment", ".env", "configuration"]);
  const hasTests = includesAny(lowered, ["test", "testing"]);

  const score = [hasInstallation, hasUsage, hasEnv, hasTests].filter(Boolean).length;
  if (score >= 3) {
    return {
      completeness: "README appears reasonably complete for onboarding.",
      missing: score === 4 ? [] : ["Some advanced operational details may be missing."],
      onboardingDifficulty: "low",
    };
  }

  return {
    completeness: "README has partial onboarding details.",
    missing: [
      ...(hasInstallation ? [] : ["Explicit dependency installation steps"]),
      ...(hasUsage ? [] : ["How to run the project locally"]),
      ...(hasEnv ? [] : ["Environment variable documentation"]),
      ...(hasTests ? [] : ["How to run the tests"]),
    ],
    onboardingDifficulty: "medium",
  };
}

function inferDeploymentSignals(treePaths: string[], readmeText: string): {
  ciCd: string[];
  containers: string[];
  cloud: string[];
  productionArchitecture: string;
} {
  const pathSet = toSet(treePaths);
  const ciCd: string[] = [];
  const containers: string[] = [];
  const cloud: string[] = [];

  if (treePaths.some((path) => path.startsWith(".github/workflows/"))) {
    ciCd.push("GitHub Actions workflow files detected.");
  }
  if (pathSet.has("Dockerfile")) {
    containers.push("Dockerfile detected.");
  }
  if (pathSet.has("docker-compose.yml") || pathSet.has("docker-compose.yaml")) {
    containers.push("Docker Compose configuration detected.");
  }
  if (pathSet.has("vercel.json") || includesAny(readmeText, ["vercel"])) {
    cloud.push("Vercel deployment signals detected.");
  }
  if (includesAny(readmeText, ["aws", "gcp", "azure", "kubernetes"])) {
    cloud.push("Cloud or orchestration references appear in README.");
  }

  return {
    ciCd: ciCd.length > 0 ? ciCd : ["No explicit CI/CD config detected in scanned files."],
    containers: containers.length > 0 ? containers : ["No container config detected in root scan."],
    cloud: cloud.length > 0 ? cloud : ["No cloud platform clearly indicated by scanned files."],
    productionArchitecture:
      containers.length > 0 || cloud.length > 0
        ? "Deployment likely uses CI/CD with container and/or managed cloud runtime."
        : "Production architecture is not explicit; likely depends on project-level runtime defaults.",
  };
}

function inferApiSignals(treePaths: string[], packageNames: string[], readmeText: string): {
  endpoints: string[];
  requestResponse: string[];
  auth: string;
} {
  const endpoints: string[] = [];
  if (treePaths.some((path) => path.includes("/api/") || path.startsWith("api/"))) {
    endpoints.push("API route files detected in repository tree.");
  }
  if (treePaths.includes("openapi.yaml") || treePaths.includes("openapi.json")) {
    endpoints.push("OpenAPI specification file detected.");
  }
  if (includesAny(readmeText, ["/api", "endpoint", "rest"])) {
    endpoints.push("README references API endpoints or REST usage.");
  }

  const requestResponse: string[] = [];
  if (packageNames.some((pkg) => pkg.includes("zod") || pkg.includes("joi"))) {
    requestResponse.push("Schema validation library detected for request/response payloads.");
  }
  if (packageNames.some((pkg) => pkg.includes("express") || pkg.includes("fastify") || pkg.includes("next"))) {
    requestResponse.push("HTTP framework detected for API surface.");
  }
  if (requestResponse.length === 0) {
    requestResponse.push("Request/response contracts need deeper code-level inspection.");
  }

  const authMatches = inferFromKeywords(packageNames, AUTH_KEYWORDS);
  return {
    endpoints: endpoints.length > 0 ? endpoints : ["No explicit API endpoints found in scanned tree paths."],
    requestResponse,
    auth:
      authMatches.length > 0
        ? `Auth signals detected: ${authMatches.join(", ")}.`
        : "No dedicated auth framework detected from manifest-level scan.",
  };
}

function inferConfidence(treePaths: string[], readmeText: string, detectedFiles: string[]): Confidence {
  const score = [
    treePaths.length > 100,
    Boolean(readmeText),
    detectedFiles.length >= 2,
    treePaths.some((path) => path.startsWith("tests/") || path.startsWith("test/") || path.includes(".test.")),
  ].filter(Boolean).length;

  if (score >= 3) {
    return "high";
  }
  if (score >= 2) {
    return "medium";
  }
  return "low";
}

function getMainFeatureHints(packageNames: string[], treePaths: string[], topics: string[]): string[] {
  const features: string[] = [];
  if (packageNames.some((pkg) => pkg.includes("next"))) {
    features.push("Web application with modern SSR/SPA capabilities.");
  }
  if (packageNames.some((pkg) => pkg.includes("graphql"))) {
    features.push("GraphQL API/data querying patterns likely used.");
  }
  if (treePaths.some((path) => path.startsWith(".github/workflows/"))) {
    features.push("Automated CI workflows are configured.");
  }
  if (treePaths.some((path) => path.includes("docker"))) {
    features.push("Containerized runtime support appears to be included.");
  }
  if (topics.length > 0) {
    features.push(`Repository tags highlight focus areas: ${topics.slice(0, 5).join(", ")}.`);
  }
  return features.length > 0 ? features : ["Feature set inferred from metadata is limited; deep code scan recommended."];
}

export function buildFullRepositoryAnalysis(input: BuildAnalysisInput): AnalysisResult {
  const packageNames = parsePackageDependencies(input.packageJsonText);
  const pythonPackages = extractPythonPackages(input.requirementsText, input.pyprojectText);
  const allPackages = unique([...packageNames, ...pythonPackages]);

  const techStackFromFiles = detectTechStackFromFiles(input.detectedFiles);
  const frameworks = unique([
    ...techStackFromFiles.frameworks,
    ...inferFromKeywords(allPackages, FRAMEWORK_KEYWORDS),
  ]);
  const databases = unique([
    ...techStackFromFiles.databases,
    ...inferFromKeywords(allPackages, DATABASE_KEYWORDS),
  ]);

  const tooling = unique([
    ...techStackFromFiles.tooling,
    ...(input.treePaths.some((path) => path.startsWith(".github/workflows/")) ? ["GitHub Actions"] : []),
    ...(allPackages.some((pkg) => pkg.includes("eslint")) ? ["ESLint"] : []),
    ...(allPackages.some((pkg) => pkg.includes("prettier")) ? ["Prettier"] : []),
  ]);

  const infrastructure = unique([
    ...techStackFromFiles.infrastructure,
    ...(input.treePaths.includes("Dockerfile") ? ["Docker"] : []),
    ...(input.treePaths.some((path) => path.startsWith(".github/workflows/")) ? ["CI/CD workflows"] : []),
  ]);

  const languages = unique([
    ...techStackFromFiles.languages,
    ...(input.primaryLanguage ? [input.primaryLanguage] : []),
    ...(input.treePaths.some((path) => path.endsWith(".py")) ? ["Python"] : []),
    ...(input.treePaths.some((path) => path.endsWith(".go")) ? ["Go"] : []),
    ...(input.treePaths.some((path) => path.endsWith(".rs")) ? ["Rust"] : []),
  ]);

  const techStack: TechStack = {
    languages,
    frameworks,
    databases,
    tooling,
    infrastructure,
  };

  const structure = detectRepositoryStructure(input.treePaths);
  const readmeQuality = detectReadmeQuality(input.readmeText);
  const deploymentSignals = inferDeploymentSignals(input.treePaths, input.readmeText);
  const apiSignals = inferApiSignals(input.treePaths, allPackages, input.readmeText);
  const tests = inferFromKeywords(allPackages, TEST_KEYWORDS);
  const confidence = inferConfidence(input.treePaths, input.readmeText, input.detectedFiles);

  const evidenceLedger: EvidenceItem[] = [
    {
      source: "Git tree scan",
      signal: `${input.treePaths.length} file paths inspected via GitHub API.`,
      supports: "Repository structure and architecture signals",
    },
    {
      source: "Manifest detection",
      signal: input.detectedFiles.length > 0 ? input.detectedFiles.join(", ") : "No known manifests in root set.",
      supports: "Tech stack and setup inference",
    },
    {
      source: "README",
      signal: input.readmeText ? "README content decoded and inspected." : "README unavailable or empty.",
      supports: "Project purpose, setup, and documentation quality",
    },
    {
      source: "Repository metadata",
      signal: `Stars ${input.activity.stars}, forks ${input.activity.forks}, open issues ${input.activity.openIssues}.`,
      supports: "Maturity, adoption, and quick summary",
    },
  ];

  return {
    repo: input.repo,
    techStack,
    summary: {
      whatItIs:
        input.repo.description ||
        `${input.repo.name} is a software project with repository-driven architecture and workflow signals.`,
      realWorldUses:
        input.topics.length > 0
          ? input.topics.slice(0, 4).map((topic) => `Useful for products in the ${topic} domain.`)
          : [
              "Reference implementation for developers in similar domains.",
              "Foundation for extending with custom business workflows.",
            ],
      mainFeatures: getMainFeatureHints(allPackages, input.treePaths, input.topics),
    },
    projectOverview: {
      purpose:
        input.repo.description ||
        `Provide functionality represented by ${input.repo.name} and its repository artifacts.`,
      problemItSolves:
        input.topics.length > 0
          ? `Addresses needs related to ${input.topics.slice(0, 3).join(", ")}.`
          : "Automates or simplifies a domain-specific development problem.",
      targetUsersOrUseCases:
        input.topics.length > 0
          ? input.topics.slice(0, 4).map((topic) => `Teams or developers working on ${topic}.`)
          : ["Developers evaluating reusable open-source components."],
      highLevelHowItWorks:
        "Clients interact with application/runtime entry points, business logic executes in core modules, and outputs are returned through UI/API surfaces inferred from repository structure.",
    },
    repositoryStructure: {
      keyFolders: structure.keyFolders,
      keyFiles: structure.keyFiles.length > 0 ? structure.keyFiles : ["Key files are not obvious from current scan."],
      configurationFiles:
        structure.configurationFiles.length > 0
          ? structure.configurationFiles
          : ["No standard configuration files detected from root-level scan."],
      entryPoints:
        structure.entryPoints.length > 0
          ? structure.entryPoints
          : ["No conventional entry point file detected; framework conventions may apply."],
    },
    architecture: {
      highLevelArchitecture:
        frameworks.length > 0
          ? `Primary architecture appears to rely on ${frameworks.slice(0, 2).join(" + ")} with modular repository organization on branch ${input.defaultBranch}.`
          : `Architecture appears modular, inferred from folder decomposition and config manifests on branch ${input.defaultBranch}.`,
      componentsAndInteractions: [
        "Source modules under main code folders provide business/domain logic.",
        "Configuration manifests define runtime and dependency behavior.",
        "Optional API layer and frontend/backend boundaries inferred from path patterns.",
      ],
      dataFlow: [
        "Input enters via CLI/UI/API entry points.",
        "Internal modules perform transformation and domain processing.",
        "Output is emitted as responses, files, or runtime side effects based on project type.",
      ],
      apisOrServices: apiSignals.endpoints,
    },
    coreModules: {
      mainClassesOrFunctions:
        structure.entryPoints.length > 0
          ? structure.entryPoints.map((entry) => `Entry candidate: ${entry}`)
          : ["Main module boundaries need deeper source-level AST analysis."],
      keyAlgorithms: [
        "Algorithmic details are inferred weakly from file organization and dependency signals.",
        "For exact complexity and correctness, function-level static analysis should be enabled.",
      ],
      businessLogic: [
        "Business rules likely live under source folders such as src/app/lib based on convention.",
        "Topic and README cues indicate primary domain responsibilities.",
      ],
      importantDesignDecisions: [
        "Use of manifest-driven dependency management suggests maintainable modular architecture.",
        "Presence/absence of CI, tests, and containers indicates operational maturity decisions.",
      ],
    },
    setupAndInstallation: {
      prerequisites: [
        ...(input.detectedFiles.includes("package.json") ? ["Node.js and npm/pnpm/yarn"] : []),
        ...(input.detectedFiles.includes("requirements.txt") || input.detectedFiles.includes("pyproject.toml")
          ? ["Python and pip/poetry"]
          : []),
        ...(input.detectedFiles.includes("Dockerfile") ? ["Docker (optional containerized execution)"] : []),
      ].slice(0, 6),
      installDependencies: [
        ...(input.detectedFiles.includes("package.json") ? ["Run `npm install` (or project package manager)."] : []),
        ...(input.detectedFiles.includes("requirements.txt") ? ["Run `pip install -r requirements.txt`."] : []),
        ...(input.detectedFiles.includes("pyproject.toml") ? ["Run `poetry install` if Poetry is used."] : []),
      ].slice(0, 6),
      environmentVariables: includesAny(input.readmeText, [".env", "environment"])
        ? ["README references environment configuration; define required variables before runtime."]
        : ["Environment variable requirements are not explicit from scanned artifacts."],
      runLocally: [
        ...(input.detectedFiles.includes("package.json") ? ["Run `npm run dev` or `npm start` depending on scripts."] : []),
        ...(input.detectedFiles.includes("requirements.txt") || input.detectedFiles.includes("pyproject.toml")
          ? ["Run the project entry command documented in README."]
          : []),
      ].slice(0, 6),
    },
    exampleExecutionFlow: {
      input: "User or system input enters through API/UI/CLI boundary inferred from entry points.",
      internalProcessing: [
        "Runtime initializes dependencies and configuration from manifest files.",
        "Request/task is routed to core business logic modules.",
        "Data transformations and optional persistence steps execute.",
      ],
      output: "Processed response/result is returned to caller or written to persistent/storage target.",
    },
    apiInterfaces: {
      endpoints: apiSignals.endpoints,
      requestResponseStructure: apiSignals.requestResponse,
      authentication: apiSignals.auth,
    },
    databaseAndDataModels: {
      schema:
        databases.length > 0
          ? `Database signals detected: ${databases.join(", ")}. Schema likely managed by project ORM/migration tools.`
          : "No clear database schema artifacts detected in manifest/root scan.",
      relationships:
        input.treePaths.includes("prisma/schema.prisma") || input.treePaths.some((path) => path.includes("migrations"))
          ? ["Relational/data model relationships likely defined in schema or migration files."]
          : ["Relationships are not explicit from scanned files."],
      dataLifecycle: [
        "Data ingress via API/UI or scheduled tasks (if present).",
        "Transformation by domain logic modules.",
        "Persistence lifecycle depends on detected database/ORM tooling.",
      ],
    },
    testing: {
      testFrameworks: tests.length > 0 ? tests : ["No clear testing framework detected from manifests."],
      coverageNotes: [
        input.treePaths.some((path) => path.startsWith("tests/") || path.startsWith("test/") || path.includes(".test."))
          ? "Dedicated test files/folders are present."
          : "Test coverage may be limited or not visible in scanned tree paths.",
      ],
      runTests:
        tests.length > 0
          ? [
              "Use package manager test commands (e.g., `npm test`) or framework-specific commands.",
              "Verify CI workflow for canonical test command.",
            ]
          : ["No standard test execution command could be inferred confidently."],
    },
    performanceAndScalability: {
      bottlenecks: [
        "Potential bottlenecks likely around I/O, DB queries, or API call fan-out.",
        "Exact hotspots require runtime profiling and trace instrumentation.",
      ],
      optimizationTechniques: [
        ...(includesAny(input.readmeText, ["cache", "caching"]) || allPackages.some((pkg) => pkg.includes("redis"))
          ? ["Caching signals detected; likely used for response/data acceleration."]
          : ["No explicit caching mechanism detected in quick scan."]),
      ],
      concurrencyOrCaching: [
        "Concurrency strategy depends on runtime framework and deployment model.",
        allPackages.some((pkg) => pkg.includes("queue") || pkg.includes("bull"))
          ? "Queue/background processing dependencies suggest asynchronous workload handling."
          : "No explicit worker/queue library detected in manifest scan.",
      ],
    },
    securityConsiderations: {
      authSystems:
        inferFromKeywords(allPackages, AUTH_KEYWORDS).length > 0
          ? inferFromKeywords(allPackages, AUTH_KEYWORDS)
          : ["No dedicated auth framework detected from manifests."],
      inputValidation:
        allPackages.some((pkg) => pkg.includes("zod") || pkg.includes("joi") || pkg.includes("yup"))
          ? ["Validation library detected; request/schema validation likely implemented."]
          : ["Input validation approach not explicit from scanned files."],
      secretsHandling: includesAny(input.readmeText, [".env", "secret", "token"])
        ? ["Repository docs reference environment-based secret handling."]
        : ["Secret handling is not explicitly documented in scanned README excerpt."],
    },
    deployment: {
      ciCdSetup: deploymentSignals.ciCd,
      dockerOrContainers: deploymentSignals.containers,
      cloudPlatforms: deploymentSignals.cloud,
      productionArchitecture: deploymentSignals.productionArchitecture,
    },
    codeQualityReview: {
      designPatterns: [
        "Module-based organization indicates separation of concerns.",
        "Manifest + config layering suggests explicit runtime boundaries.",
      ],
      maintainability: [
        allPackages.some((pkg) => pkg.includes("typescript"))
          ? "TypeScript signals suggest stronger static maintainability."
          : "Dynamic typing may increase runtime regression risk if tests are weak.",
        input.treePaths.some((path) => path.startsWith(".github/workflows/"))
          ? "CI workflow presence improves maintainability discipline."
          : "No CI workflow detected; quality gates may be manual.",
      ],
      potentialIssuesOrBugs: [
        "Manifest-level analysis cannot verify algorithmic correctness.",
        "Missing tests or sparse docs can increase onboarding and regression risk.",
      ],
      suggestionsForImprovement: [
        "Document architecture and data flow explicitly in README/docs.",
        "Add/expand automated tests for critical paths.",
        "Add structured observability (logs, metrics, traces) for production reliability.",
      ],
    },
    documentationQuality: {
      readmeCompleteness: readmeQuality.completeness,
      missingExplanations: readmeQuality.missing,
      onboardingDifficulty: readmeQuality.onboardingDifficulty,
    },
    realWorldUseOrAlternatives: {
      comparableProjects:
        frameworks.length > 0
          ? frameworks.slice(0, 3).map((framework) => `Comparable ecosystem projects built with ${framework}.`)
          : ["Comparable projects depend on specific domain; use topic tags to shortlist alternatives."],
      whenToUseThisVsSomethingElse: [
        "Use this project when its stack and architecture signals match your team constraints.",
        "Prefer alternatives when deployment/runtime or data model assumptions differ from your requirements.",
      ],
    },
    quickSummary: {
      strengths: [
        "Structured repository with detectable build/runtime signals.",
        "Manifest and metadata evidence enables deterministic inference.",
        "Contributor/activity data provides project maturity context.",
      ],
      weaknesses: [
        "Heuristic scan cannot replace function-level deep code review.",
        "Accuracy depends on documentation quality and conventional file organization.",
      ],
      overallEvaluation:
        "Promising repository baseline with useful architecture and stack indicators; run deep module-level review for production adoption decisions.",
    },
    differentiator: {
      whatMakesRepoRadarDifferent:
        "RepoRadar prioritizes evidence-first analysis: each major claim is anchored to concrete repository signals (files, manifests, metadata) instead of free-form generative text.",
      evidenceLedger,
      confidenceRationale:
        "Confidence is computed from observable signals (tree coverage, manifests, README quality, and test artifacts), making uncertainty explicit.",
    },
    insights: {
      contributors: input.contributors,
      activity: input.activity,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      analysisMode: "heuristic",
      confidence,
    },
  };
}
