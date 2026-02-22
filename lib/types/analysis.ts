export type Confidence = "low" | "medium" | "high";
export type AnalysisMode = "heuristic" | "ai-assisted";

export interface RepoInfo {
  owner: string;
  name: string;
  url: string;
  description: string;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  tooling: string[];
  infrastructure: string[];
}

export interface RepoSummary {
  whatItIs: string;
  realWorldUses: string[];
  mainFeatures: string[];
}

export interface ContributorInsight {
  login: string;
  contributions: number;
}

export interface ActivityInsight {
  stars: number;
  forks: number;
  openIssues: number;
  lastPush: string;
}

export interface RepoInsights {
  contributors: ContributorInsight[];
  activity: ActivityInsight;
}

export interface AnalysisMeta {
  generatedAt: string;
  analysisMode: AnalysisMode;
  confidence: Confidence;
}

export interface AnalysisResult {
  repo: RepoInfo;
  techStack: TechStack;
  summary: RepoSummary;
  insights: RepoInsights;
  meta: AnalysisMeta;
}

