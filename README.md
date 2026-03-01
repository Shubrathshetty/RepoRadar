# RepoRadar

RepoRadar is a full-stack Next.js app that analyzes public GitHub repositories and generates a structured technical explanation.

It combines:
- Deterministic repository signals (tree paths, manifests, README, metadata)
- Heuristic section builders
- Optional Gemini enhancement (including deep code pass)

## What it does

- Accepts a public GitHub repository URL
- Scans repository structure and key files using GitHub API
- Detects stack indicators (languages, frameworks, tooling, infra hints)
- Generates a multi-section engineering report
- Shows architecture and execution-flow explanation
- Supports optional deep Gemini module-level reasoning
- Collects user ratings, reviews, feedback, and contact messages
- Supports light/dark theme with persistent preference

## Architecture overview

1. User submits a repository URL from the frontend form.
2. `POST /api/analyze` validates input and fetches repository signals from GitHub.
3. Backend analyzers build a heuristic `AnalysisResult`.
4. If Gemini is configured, narrative sections are refined.
5. If deep analysis is enabled, sampled code snippets are sent for a second Gemini pass.
6. Final structured analysis JSON is returned and rendered section-by-section in UI.

## Project structure

```text
RepoRadar/
|-- app/                          # Next.js App Router entrypoints + API routes
|   |-- page.tsx                 # Landing page composition
|   |-- layout.tsx               # Root layout, navigation, theme provider
|   `-- api/
|       |-- analyze/route.ts     # Core repository analysis endpoint
|       |-- contact/route.ts     # Contact form storage
|       |-- feedback/route.ts    # Feedback storage
|       |-- ratings/route.ts     # Rating stats + submissions
|       |-- reviews/route.ts     # Reviews CRUD-like handlers
|       `-- testimonials/route.ts# Static testimonials endpoint
|
|-- frontend/                    # Frontend-only source
|   |-- components/
|   |   |-- repo-analyzer-form.tsx
|   |   |-- theme-toggle.tsx
|   |   |-- testimonials.tsx
|   |   |-- reviews-list.tsx
|   |   |-- feedback-form.tsx
|   |   |-- contact-section.tsx
|   |   |-- rating-system.tsx
|   |   `-- ui/index.tsx         # Shared UI primitives
|   `-- lib/
|       `-- theme-context.tsx    # Theme context + persistence
|
|-- backend/                     # Backend/domain logic
|   |-- analyzers/
|   |   |-- full-report.ts       # Heuristic report builder
|   |   |-- gemini-enhancer.ts   # Gemini narrative + deep code enhancement
|   |   |-- summary.ts
|   |   `-- tech-stack.ts
|   |-- github/
|   |   |-- client.ts            # Octokit client creation
|   |   `-- url.ts               # GitHub URL parser
|   `-- types/
|       |-- analysis.ts          # Main analysis schema/types
|       `-- feedback.ts
|
|-- data/                        # Local JSON storage for forms/reviews/ratings
|-- scripts/
|   `-- dev.mjs                  # Flexible dev runner with custom dist dirs
|-- public/
|-- next.config.ts
|-- tsconfig.json
`-- package.json
```

## Tech stack

- Framework: Next.js 16 (App Router, Turbopack)
- Language: TypeScript
- UI: React 19 + Tailwind CSS 4
- Validation: Zod
- GitHub integration: `@octokit/rest`
- AI integration: Google Gemini API (REST)
- Persistence: File-based JSON in `data/`
- Linting/typing: ESLint + TypeScript (`tsc --noEmit`)

## Analysis output model

RepoRadar returns a strongly-typed `AnalysisResult` with sections such as:
- Project overview
- Repository structure
- Tech stack
- Architecture and flow
- Core modules
- Setup and installation
- API interfaces
- Data models
- Testing
- Performance
- Security
- Deployment
- Code quality
- Documentation quality
- Quick summary
- Evidence ledger and confidence metadata

## API endpoints

- `POST /api/analyze` - analyze a GitHub repository
- `POST /api/contact` - submit contact message
- `POST /api/feedback` - submit categorized feedback
- `GET/POST /api/ratings` - fetch and submit ratings
- `GET/POST/PATCH /api/reviews` - review operations
- `GET /api/testimonials` - fetch testimonials

## Getting started

### 1) Prerequisites

- Node.js 20+ (24.x also works)
- npm

### 2) Install

```bash
npm install
```

### 3) Configure environment

Create `.env.local`:

```env
# Optional but recommended for higher GitHub API limits
GITHUB_TOKEN=your_github_token

# Gemini options (optional, enables ai-assisted mode)
GEMINI_API_KEY=your_gemini_api_key
# Optional aliases supported by code:
# GOOGLE_AI_API_KEY=your_key
# GOOGLE_API_KEY=your_key

# Optional model override
GEMINI_MODEL=gemini-2.0-flash
```

### 4) Run locally

Default:

```bash
npm run dev
```

Custom port:

```bash
npm run dev -- --port 3001
```

Or:

```bash
PORT=3001 npm run dev
```

### 5) Quality checks

```bash
npm run typecheck
npm run lint
```

## Skills gained from this project

This project demonstrates and helps build skills in:

- Repository intelligence design (evidence-first analysis)
- Full-stack architecture with clear frontend/backend boundaries
- Next.js App Router API route engineering
- External API orchestration (GitHub + Gemini)
- Prompt engineering for structured JSON outputs
- Schema-driven validation with Zod
- Robust error mapping and fallback strategies
- Theme systems (light/dark with persisted preference)
- UX for AI features (deep analysis toggle with cost/latency awareness)
- Lightweight data persistence and API design
- Type-safe domain modeling in TypeScript

## Notes and limitations

- Current analysis supports public repositories.
- Local JSON persistence in `data/` is suitable for demos/prototypes.
- Deep Gemini analysis increases latency and token usage.
- Analysis quality depends on available repository signals (README, manifests, tree coverage).

## License

This project is licensed under the MIT License. See `LICENSE`.
