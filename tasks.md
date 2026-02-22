# RepoRadar Tasks Backlog

## Last Updated
February 22, 2026

## Priority Key
- P0: Must-have for MVP launch
- P1: Important, can slip with explicit approval
- P2: Post-MVP enhancements

## Epic 1: Project Setup and Tooling
- [ ] P0 Initialize Next.js App Router project with TypeScript
- [ ] P0 Install and configure Tailwind CSS
- [ ] P0 Add ESLint and TypeScript strict settings
- [ ] P0 Configure environment variable handling (`.env.local.example`)
- [ ] P0 Add npm scripts: `dev`, `build`, `start`, `lint`, `typecheck`
- [ ] P0 Setup Vercel project and GitHub auto-deploy
- [ ] P1 Add pre-commit hooks for lint/typecheck

## Epic 2: URL Input and Validation
- [ ] P0 Build homepage with repository URL input form
- [ ] P0 Implement GitHub URL parser utility (owner/repo extraction)
- [ ] P0 Validate accepted URL formats and show inline errors
- [ ] P0 Normalize URL variations (trailing slash, query params)
- [ ] P1 Add sample URL quick-fill buttons

## Epic 3: GitHub API Integration
- [ ] P0 Add Octokit server client wrapper
- [ ] P0 Implement repo metadata fetch
- [ ] P0 Implement README fetch (fallback among common README names)
- [ ] P0 Implement manifest/config fetch strategy for known files
- [ ] P0 Implement top contributors fetch (bounded list)
- [ ] P0 Implement rate-limit error handling and user-friendly messaging
- [ ] P1 Add retries with exponential backoff for transient failures

## Epic 4: Analysis Engine
- [ ] P0 Build deterministic tech stack detector
- [ ] P0 Add language/framework/tooling/infrastructure grouping logic
- [ ] P0 Build heuristic summary generator (what it is + main features)
- [ ] P0 Build real-world use inference from README/topics/metadata
- [ ] P0 Add confidence scoring and evidence capture per section
- [ ] P1 Add detector rules for more ecosystems (Rust, Go, PHP, Ruby)

## Epic 5: API Route and Contract
- [ ] P0 Implement `POST /api/analyze` route handler
- [ ] P0 Validate request payload and return typed error responses
- [ ] P0 Return standardized JSON response (from PRD schema)
- [ ] P0 Add server-side timeout guard and partial-result fallback
- [ ] P1 Add schema validation with Zod for request/response types

## Epic 6: Results UI
- [ ] P0 Build loading/success/error state views
- [ ] P0 Build structured result sections:
  - Overview
  - Tech Stack
  - Potential Uses
  - Features
  - Contributors & Activity
- [ ] P0 Add responsive layout support (mobile + desktop)
- [ ] P1 Add copy-to-clipboard summary action
- [ ] P1 Add shareable result URL state (client-side encoded)

## Epic 7: Optional AI Enhancement
- [ ] P1 Integrate Vercel AI SDK behind feature flag
- [ ] P1 Add AI prompt templates using repo metadata + README context
- [ ] P1 Add AI failure fallback to deterministic summary path
- [ ] P1 Add model usage guardrails (token/time limits)

## Epic 8: Quality and Testing
- [ ] P0 Unit tests for URL parser and tech detection rules
- [ ] P0 Integration tests for `POST /api/analyze`
- [ ] P0 Component tests for key UI states
- [ ] P0 Add benchmark set of public repos for accuracy/performance checks
- [ ] P1 Add end-to-end smoke tests for happy and error flows

## Epic 9: Observability and Ops
- [ ] P0 Add structured server logging
- [ ] P0 Add centralized error capture hook
- [ ] P0 Add request timing metrics for API latency
- [ ] P1 Add simple analytics events (analyze_started, analyze_succeeded, analyze_failed)

## Epic 10: Launch Readiness
- [ ] P0 Finalize MVP acceptance checklist
- [ ] P0 Validate production environment variables on Vercel
- [ ] P0 Run launch smoke tests on production build
- [ ] P0 Prepare README with setup, env vars, architecture, and API contract
- [ ] P0 Tag v1.0.0 release

## Acceptance Checklist (MVP)
- [ ] URL submission works for valid public repos
- [ ] Invalid/inaccessible repos return clear, actionable errors
- [ ] Result includes all core sections from PRD
- [ ] Median response time <= 10 seconds on benchmark set
- [ ] Deployment stable on Vercel production

## Suggested Initial Sprint (Sprint 1)
- [ ] P0 Epic 1 core setup tasks
- [ ] P0 Epic 2 all tasks
- [ ] P0 Epic 3 metadata + README + errors
- [ ] P0 Epic 5 route skeleton + typed responses
- [ ] P0 Basic UI states from Epic 6
