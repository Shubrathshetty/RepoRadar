# RepoRadar Roadmap

## Version
v1.0 (MVP Execution)

## Last Updated
February 22, 2026

## Objective
Deliver an MVP web application that analyzes public GitHub repositories and returns a structured explanation including purpose, tech stack, likely uses, features, and contributor/activity insights.

## Phase 0: Foundation (Week 1)
### Outcomes
- Working Next.js + TypeScript + Tailwind project skeleton
- Deployment pipeline connected to Vercel
- Initial UX shell with URL input and results layout placeholders

### Deliverables
- Next.js App Router setup
- Tailwind configured with responsive base styles
- Environment variable scaffolding (`GITHUB_TOKEN`, optional `OPENAI_API_KEY`/AI provider key)
- Basic CI checks (lint + typecheck)
- Vercel preview deploy from GitHub

### Exit Criteria
- App runs locally and on Vercel preview
- URL form renders and submits to stubbed API successfully

## Phase 1: Core Analysis Engine (Week 2)
### Outcomes
- End-to-end repository fetch and deterministic analysis path
- Stable server API route for analysis

### Deliverables
- `POST /api/analyze` route handler
- GitHub URL parser + validation
- Octokit client wrapper with rate-limit/error handling
- File detector for manifests and config files
- Tech stack inference module (languages/frameworks/tooling/infrastructure)

### Exit Criteria
- Valid public GitHub URLs return structured JSON with stack output
- Invalid URLs and inaccessible repos return clear error responses

## Phase 2: Explanation UX and Insights (Week 3)
### Outcomes
- Production-quality user flow for analysis results
- Useful, readable explanation sections for non-expert users

### Deliverables
- Result UI sections:
  - Overview
  - Tech Stack
  - Real-World Uses
  - Main Features
  - Contributors & Activity
- README + metadata summarization (heuristic baseline)
- Contributor/activity insights (stars/forks/open issues/last push)
- Loading, empty, and failure states

### Exit Criteria
- User can submit URL and get complete explanation in target median <= 10s (common repos)
- Core MVP sections all populated or explicitly marked unavailable

## Phase 3: Reliability, Optional AI, Launch Readiness (Week 4)
### Outcomes
- MVP hardened for public release
- Optional AI-enhanced explanation path available behind feature flag

### Deliverables
- Optional Vercel AI SDK integration for better use-case/feature inference
- Caching strategy (short TTL for repo metadata)
- Timeouts + partial result fallback behavior
- Basic observability (structured logs, error monitoring hook)
- Launch checklist completion

### Exit Criteria
- Reliability goals reached in smoke tests
- Launch checklist signed off
- Production deployment on Vercel completed

## Post-MVP (v1.1+)
- Private repo support via GitHub OAuth
- Saved analysis history and sharing links
- Comparative repo analysis
- Evidence panel linking each inference to file/source snippets
- Team workspaces and collaboration features

## Milestone Gates
1. Gate A (End Week 1): Setup complete, deploy pipeline green
2. Gate B (End Week 2): Core API + deterministic stack detection live
3. Gate C (End Week 3): Complete MVP UX with explanation sections
4. Gate D (End Week 4): Hardening, optional AI, production launch

## Key Risks and Mitigations
- GitHub rate limits: tokenized server requests, bounded API calls, cache responses
- Monorepo complexity: prioritize key files, strict timeout, partial results
- Inference quality variability: confidence levels + explainability metadata

## Success Metrics
- Median analysis latency: <= 10s
- Analysis success rate on valid public repos: >= 95%
- Tech stack detection precision benchmark: >= 85%
- Positive user usefulness signal: >= 70%

## Ownership Model
- Product: scope, metrics, launch criteria
- Engineering: API, analyzers, frontend, deployment
- QA: acceptance checks, regression checks, edge-case validation
