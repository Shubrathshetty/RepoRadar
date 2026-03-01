import type { TechStack } from "@/backend/types/analysis";

const FILE_TO_TECH: Record<string, Partial<TechStack>> = {
  "package.json": {
    languages: ["JavaScript/TypeScript"],
    tooling: ["npm"],
  },
  "pnpm-lock.yaml": {
    tooling: ["pnpm"],
  },
  "yarn.lock": {
    tooling: ["Yarn"],
  },
  "requirements.txt": {
    languages: ["Python"],
  },
  "pyproject.toml": {
    languages: ["Python"],
    tooling: ["Poetry or PEP 621 tooling"],
  },
  "Cargo.toml": {
    languages: ["Rust"],
    tooling: ["Cargo"],
  },
  "go.mod": {
    languages: ["Go"],
  },
  Dockerfile: {
    infrastructure: ["Docker"],
  },
};

function addUnique(target: string[], values: string[] = []): void {
  for (const value of values) {
    if (!target.includes(value)) {
      target.push(value);
    }
  }
}

export function detectTechStackFromFiles(files: string[]): TechStack {
  const result: TechStack = {
    languages: [],
    frameworks: [],
    databases: [],
    tooling: [],
    infrastructure: [],
  };

  for (const file of files) {
    const mapped = FILE_TO_TECH[file];
    if (!mapped) {
      continue;
    }

    addUnique(result.languages, mapped.languages);
    addUnique(result.frameworks, mapped.frameworks);
    addUnique(result.databases, mapped.databases);
    addUnique(result.tooling, mapped.tooling);
    addUnique(result.infrastructure, mapped.infrastructure);
  }

  if (files.includes("package.json")) {
    addUnique(result.frameworks, ["React/Next.js ecosystem"]);
  }

  return result;
}
