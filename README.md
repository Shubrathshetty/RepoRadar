## RepoRadar

RepoRadar analyzes public GitHub repositories and returns a structured technical report.

## Environment Variables

Create `.env.local` with:

```bash
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
# Optional
GEMINI_MODEL=gemini-2.0-flash
```

- `GITHUB_TOKEN` improves GitHub API reliability/rate limits.
- `GEMINI_API_KEY` enables AI-assisted enhancement of architecture, flow, and summary sections.
- If Gemini is missing or fails, RepoRadar automatically falls back to heuristic mode.
- Optional deep code pass is controlled from the UI toggle and triggers a second Gemini call over sampled source files.

## Getting Started

Run the development server:

```bash
npm run dev
npm run dev -- --port 3001
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Port flexibility notes:
- RepoRadar now isolates Next.js dev build output per port (for example, `.next-dev-3000`, `.next-dev-3001`).
- This avoids `.next/dev/lock` collisions when running multiple dev instances on different ports.

## Notes

- `POST /api/analyze` always returns a deterministic baseline analysis.
- When Gemini is configured, the response `meta.analysisMode` is set to `ai-assisted`.
- `POST /api/analyze` accepts optional `deepAnalysis: boolean` for a second code-level Gemini pass.
