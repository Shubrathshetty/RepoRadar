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
  databases: string[];
  tooling: string[];
  infrastructure: string[];
}

export interface RepoSummary {
  whatItIs: string;
  realWorldUses: string[];
  mainFeatures: string[];
}

export interface ProjectOverview {
  purpose: string;
  problemItSolves: string;
  targetUsersOrUseCases: string[];
  highLevelHowItWorks: string;
}

export interface RepositoryStructure {
  keyFolders: string[];
  keyFiles: string[];
  configurationFiles: string[];
  entryPoints: string[];
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

export interface ArchitectureSection {
  highLevelArchitecture: string;
  componentsAndInteractions: string[];
  dataFlow: string[];
  apisOrServices: string[];
}

export interface CoreModulesSection {
  mainClassesOrFunctions: string[];
  keyAlgorithms: string[];
  businessLogic: string[];
  importantDesignDecisions: string[];
}

export interface SetupInstallationSection {
  prerequisites: string[];
  installDependencies: string[];
  environmentVariables: string[];
  runLocally: string[];
}

export interface ExampleExecutionFlowSection {
  input: string;
  internalProcessing: string[];
  output: string;
}

export interface ApiInterfacesSection {
  endpoints: string[];
  requestResponseStructure: string[];
  authentication: string;
}

export interface DatabaseDataModelsSection {
  schema: string;
  relationships: string[];
  dataLifecycle: string[];
}

export interface TestingSection {
  testFrameworks: string[];
  coverageNotes: string[];
  runTests: string[];
}

export interface PerformanceScalabilitySection {
  bottlenecks: string[];
  optimizationTechniques: string[];
  concurrencyOrCaching: string[];
}

export interface SecurityConsiderationsSection {
  authSystems: string[];
  inputValidation: string[];
  secretsHandling: string[];
}

export interface DeploymentSection {
  ciCdSetup: string[];
  dockerOrContainers: string[];
  cloudPlatforms: string[];
  productionArchitecture: string;
}

export interface CodeQualityReviewSection {
  designPatterns: string[];
  maintainability: string[];
  potentialIssuesOrBugs: string[];
  suggestionsForImprovement: string[];
}

export interface DocumentationQualitySection {
  readmeCompleteness: string;
  missingExplanations: string[];
  onboardingDifficulty: string;
}

export interface RealWorldUseAlternativesSection {
  comparableProjects: string[];
  whenToUseThisVsSomethingElse: string[];
}

export interface QuickSummarySection {
  strengths: string[];
  weaknesses: string[];
  overallEvaluation: string;
}

export interface EvidenceItem {
  source: string;
  signal: string;
  supports: string;
}

export interface DifferentiatorSection {
  whatMakesRepoRadarDifferent: string;
  evidenceLedger: EvidenceItem[];
  confidenceRationale: string;
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
  projectOverview: ProjectOverview;
  repositoryStructure: RepositoryStructure;
  architecture: ArchitectureSection;
  coreModules: CoreModulesSection;
  setupAndInstallation: SetupInstallationSection;
  exampleExecutionFlow: ExampleExecutionFlowSection;
  apiInterfaces: ApiInterfacesSection;
  databaseAndDataModels: DatabaseDataModelsSection;
  testing: TestingSection;
  performanceAndScalability: PerformanceScalabilitySection;
  securityConsiderations: SecurityConsiderationsSection;
  deployment: DeploymentSection;
  codeQualityReview: CodeQualityReviewSection;
  documentationQuality: DocumentationQualitySection;
  realWorldUseOrAlternatives: RealWorldUseAlternativesSection;
  quickSummary: QuickSummarySection;
  differentiator: DifferentiatorSection;
  insights: RepoInsights;
  meta: AnalysisMeta;
}
