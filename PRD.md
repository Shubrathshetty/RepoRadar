# Product Requirements Document (PRD)

## Product Name
RepoRadar

## Version
MVP v1.0

## Document Owner
Product + Engineering

## Last Updated
February 22, 2026

## 1. Overview
RepoRadar is a web application where a user submits a GitHub repository URL and receives a structured, detailed explanation of that repository.

The app analyzes repository metadata and codebase signals to generate:
- Project name
- Brief project description
- Detected tech stack (from files such as `package.json`, `requirements.txt`, `pyproject.toml`, `Gemfile`, etc.)
- Potential real-world use cases/applications
- Additional insights such as likely core features, repository activity snapshot, and notable contributors

## 2. Problem Statement
Developers, students, recruiters, and technical evaluators often spend significant time manually understanding unfamiliar GitHub repositories. README quality varies and codebases can be large.

There is a need for a fast, trustworthy repository intelligence summary that reduces onboarding and evaluation time.

## 3. Goals and Non-Goals
### Goals (MVP)
- Accept a public GitHub repository URL.
- Parse repo metadata and key files to produce a useful explanation in under 10 seconds for common-size repositories.
- Reliably detect major technologies and frameworks.
- Provide a readable, structured output with confidence indicators where possible.
- Deploy on Vercel using a full-stack Next.js architecture.

### Non-Goals (MVP)
- Private repository analysis requiring full OAuth install flow (future phase).
- Deep static analysis of all files in very large monorepos.
- Security or license legal compliance guarantees.
- Multi-repo comparative analysis.

## 4. Target Users
- Developers evaluating dependencies/open-source projects
- Students learning from public repositories
- Technical recruiters and hiring managers screening candidate projects
- Product/engineering teams doing technical due diligence

## 5. User Stories
- As a developer, I can paste a GitHub URL and quickly understand what the project does.
- As a reviewer, I can see the stack and likely feature set without reading the whole codebase.
- As a recruiter, I can quickly assess contributor activity and project maturity signals.
- As a learner, I can discover possible real-world applications of a repo.

## 6. MVP Scope
### In Scope
- URL input and validation
- Repository data fetch from GitHub API
- Heuristic tech stack detection from known manifest/config files
- README + metadata summarization
- Basic contributor and activity insights (top contributors, stars/forks/open issues)
- Structured explanation UI
- Error states for invalid, missing, rate-limited, or inaccessible repositories

### Out of Scope
- Authenticated private repo access
- Export to PDF/Notion/Jira
- Team workspaces/history/accounts
- Full codebase semantic indexing

## 7. Functional Requirements
1. Repository URL Input
- System shall accept GitHub repository URLs in common formats:
  - `https://github.com/{owner}/{repo}`
  - `https://github.com/{owner}/{repo}/`
- System shall normalize and parse owner/repo from input.

2. Data Retrieval
- System shall fetch repository metadata via GitHub API (Octokit):
  - Name, description, topics, language, stars, forks, issues, default branch, last push
- System shall fetch a bounded set of files for detection and summarization:
  - README variants
  - `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
  - `requirements.txt`, `pyproject.toml`, `Pipfile`, `poetry.lock`
  - `Gemfile`, `go.mod`, `Cargo.toml`, `composer.json`
  - `Dockerfile`, `.github/workflows/*`

3. Tech Stack Detection
- System shall infer language/runtime/framework/tooling using deterministic heuristics.
- System shall produce stack output grouped by:
  - Languages
  - Frameworks/Libraries
  - Tooling/CI/CD
  - Data/Infrastructure signals

4. Explanation Generation
- System shall return a structured explanation containing:
  - Project name
  - What it is (brief description)
  - Tech stack
  - Potential real-world uses
  - Main feature hints
  - Contributor/activity insights
- If AI inference is enabled (optional), system may use Vercel AI SDK for higher-quality use-case and feature inference using README + metadata context.

5. UI/UX
- System shall show loading, success, and error states.
- System shall render output in clearly separated sections.
- System shall support responsive layouts for mobile and desktop.

6. Reliability and Limits
- System shall handle GitHub rate-limit errors gracefully.
- System shall implement timeout/fallback behavior for slow repos.
- System shall avoid fetching full repo contents in MVP.

## 8. Non-Functional Requirements
- Performance: Typical analysis response target <= 10 seconds.
- Availability: Deploy on Vercel with production reliability target aligned to platform SLA.
- Scalability: Architecture must support horizontal scaling of API requests.
- Security: No storage of GitHub tokens client-side; secrets managed with Vercel environment variables.
- Maintainability: TypeScript-first codebase with modular analyzers.
- Observability: Basic logging and error tracking hooks.

## 9. Proposed Tech Stack (MVP)
- Framework: Next.js (App Router) for full-stack JavaScript/TypeScript
- Styling: Tailwind CSS
- GitHub Integration: Octokit (`@octokit/rest` and/or `@octokit/core`)
- Optional AI Layer: Vercel AI SDK for explanation enhancement
- Hosting/Deployment: Vercel with GitHub-based CI/CD
- Language: TypeScript

## 10. High-Level Architecture
1. Frontend (Next.js pages/components)
- Input form for GitHub URL
- Result cards/sections for generated insights

2. Backend (Next.js API routes / Route Handlers)
- `POST /api/analyze`
- Validate URL -> Fetch GitHub data -> Run analyzers -> Return structured JSON

3. Analysis Engine (server modules)
- URL parser
- GitHub client wrapper (Octokit)
- Manifest detectors
- README + metadata summarizer (heuristic and optional AI path)
- Insight composer

## 11. Output Schema (Response Contract)
```json
{
  "repo": {
    "owner": "string",
    "name": "string",
    "url": "string",
    "description": "string"
  },
  "techStack": {
    "languages": ["string"],
    "frameworks": ["string"],
    "tooling": ["string"],
    "infrastructure": ["string"]
  },
  "summary": {
    "whatItIs": "string",
    "realWorldUses": ["string"],
    "mainFeatures": ["string"]
  },
  "insights": {
    "contributors": [
      {
        "login": "string",
        "contributions": 0
      }
    ],
    "activity": {
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "lastPush": "ISO-8601"
    }
  },
  "meta": {
    "generatedAt": "ISO-8601",
    "analysisMode": "heuristic|ai-assisted",
    "confidence": "low|medium|high"
  }
}
```

## 12. UX Requirements
- Single prominent input field for repository URL
- Analyze button with progress indicator
- Structured sections:
  - Overview
  - Tech Stack
  - Potential Uses
  - Features
  - Contributors & Activity
- Clear inline error messages
- Copy/share summary action (nice-to-have if low effort)

## 13. API and Integration Requirements
- Use GitHub REST API via Octokit
- Optional unauthenticated mode with lower rate limits (dev only)
- Recommended authenticated token in server env for production stability
- Respect GitHub API rate-limit headers and expose friendly retry guidance

## 14. Risks and Mitigations
- Risk: GitHub rate limits.
  - Mitigation: Server token, caching, retry/backoff, bounded API calls.
- Risk: Inaccurate inference for weak README/docs.
  - Mitigation: Confidence indicators + “evidence” snippets from detected files.
- Risk: Large monorepos exceed time budget.
  - Mitigation: Analyze prioritized files only; timeout with partial results.

## 15. Success Metrics (MVP)
- Time to first analysis result (median): <= 10s
- Successful analyses for valid public URLs: >= 95%
- Tech stack detection precision on benchmark sample: >= 85%
- User-rated usefulness (thumbs up): >= 70%

## 16. Milestones
1. Week 1: Project setup (Next.js + Tailwind + TypeScript), URL parsing, base API route
2. Week 2: GitHub fetch layer (Octokit), manifest detection engine
3. Week 3: Summary composer + UI rendering + error handling
4. Week 4: Optional AI enhancement, polish, deploy to Vercel, basic monitoring

## 17. Open Questions
- Should MVP include authenticated GitHub login for higher per-user rate limits?
- Should AI-assisted mode be default or opt-in?
- What evidence snippets should be shown to justify inferences?
- Should we persist analysis history for repeat visits?

## 18. Notes on Claimed Reliability Stats
The proposal references adoption and uptime claims (e.g., “70% of modern web apps,” “99.99% uptime,” “15–20% bug reduction”). These should be treated as directional unless formally sourced and validated for external-facing materials.
