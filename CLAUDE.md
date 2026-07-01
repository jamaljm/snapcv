# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SnapCV — an AGPL-3.0, AI résumé-to-portfolio product. A user uploads a résumé PDF; a backend extracts it into a structured JSON profile via OpenAI; the app hosts a portfolio + résumé at `username.snapcv.me`. Monorepo: the Next.js frontend is at the repo root (`src/`), the Express extraction backend is in `backend/`.

## Commands

Frontend (repo root):

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build; **runs ESLint and fails the build on lint errors**
- `npm run lint` — ESLint (`next/core-web-vitals`)
- `npm start` — serve the production build
- Requires `.env.local` (copy `.env.example`): Supabase keys + backend URL. Some pages error without valid Supabase env.

Backend (`backend/`):

- `cd backend && npm install`
- `npm run dev` (nodemon) or `npm start` — http://localhost:5000
- Requires `OPENAI_KEY` in `backend/.env` — the server will not boot without it.

There is **no test suite**. Node 24 is pinned (`engines` / `.nvmrc`). Frontend deploys on Vercel (`main`); the backend runs on any Node host.

## Architecture

### `UserProfile` is the data contract
`src/lib/type.ts` defines `UserProfile` — the single shape that flows through the entire app, stored as the `resumeJson` (jsonb) column of the Supabase `users` table. The same shape is produced by the backend's OpenAI prompt (`backend/openai.js`), edited in `Home.tsx`, and rendered by the templates. **Changing what a portfolio captures means touching all four**: the type, the backend schema, the editor, and the templates. Add new fields as **optional** — existing stored profiles won't have them.

### Subdomain multi-tenancy
`src/middleware.ts` copies the request host's first label into an `x-current-path` header. Public pages read it via `headers()` and branch (see `src/lib/portfolio.ts`): landing subdomains (`www`, `snapcv`, `localhost:3000` → `LANDING_PAGES`) render the marketing `<Hero/>`; anything else is treated as a username → fetch that user's profile → render it. Routes: `app/page.tsx` = portfolio, `app/resume/page.tsx` = résumé, `app/github/page.tsx` = GitHub Wrapped. On `localhost` you get the marketing site — build a profile via `/create` and `/home`.

### Supabase access — three clients, two patterns
- `utils/supabase/client.ts` (anon, browser): client components read **and write** Supabase directly; security relies on RLS.
- `utils/supabase/supabase_service.ts` (service): used by `app/api/*` routes.
- `utils/supabase/server.ts` (SSR): only the OAuth callback.

Server components fetch the app's own `/api/*` routes by absolute URL (`NEXT_PUBLIC_API_BASE_URL`); client components hit Supabase directly. Auth is Google OAuth; guarded pages (`/home`, `/create`, `/profile`) use the **client-side** `withAuth` HOC (`utils/authProtect.tsx`) — there is no server/middleware auth gate.

### The editor (`src/components/home/Home.tsx`)
A large single client component that holds the entire `UserProfile` in one `useState` and renders ~13 section editors. Section arrays are mutated through generic helpers keyed by a dotted path (e.g. `"basics.skills"`, `"projects.projects"`):

- `handleInputChange(path, index, field, value)`
- `deleteItemByIndex(path, index, setState)`
- `reorderArray(path, oldIndex, newIndex, setState)` — drag-to-reorder

Call `markAsEdited()` after mutating so the Save action enables; `handleSaveChanges` writes `resumeJson` back to Supabase. Use these helpers when adding editor fields.

### Templates render arrays in order
- Portfolio: `components/design/temp_1.tsx`, accent from `meta.portfolioColor`.
- Résumé: `components/design/resume_template.tsx` exports a shared `ResumeContent`, reused by the editor-preview `components/ResumeTemplate.tsx` so the preview matches the live page.

Because sections render in array order, reordering an array (e.g. skills) changes the order everywhere it appears.

### Backend ingestion (`backend/`)
`POST /extract-pdf`: download a PDF → `pdf-parse` text → OpenAI (`gpt-4o-mini`, JSON mode) → `UserProfile` JSON. `backend/openai.js` holds the JSON-schema prompt — the source of truth for the shape. Guards: SSRF (`lib/url-guard.js`), per-IP rate limit (`lib/rate-limit.js`), size-capped in-memory download (`lib/pdf.js`). The frontend calls it via `NEXT_PUBLIC_BACKEND`. Note: the production instance (the private `snapcv-worker` repo) additionally has a LinkedIn scraper (`/get-resume`); it is **intentionally excluded** from this public repo because it holds confidential session cookies.

### UI stacks
Three coexist: **NextUI** (primary — editor inputs, buttons), **shadcn/ui** (`components/ui`, incl. toasts), **magicui** (`components/magicui`, animated marketing). For notifications use `toast` / `useToast` from `components/ui/use-toast` (the `<Toaster/>` is mounted in `app/layout.tsx`) — not `alert()`.

## Conventions & workflow

- **Branches**: open PRs against **`staging`** (the integration branch), not `main`. `main` is production and auto-deploys via Vercel; ship by merging `staging → main`.
- **Versioning**: semver per feature; keep `CHANGELOG.md`; tag + create a GitHub release.
- **Lint gotchas that fail the build**: page component functions must be PascalCase (`export default function Page()`, never `page()`); `react/no-unescaped-entities` is disabled in `.eslintrc.json`.
- **Remote images**: hosts must be allowlisted in `next.config.ts` → `images.remotePatterns`.
- License: **AGPL-3.0** — running a modified version as a network service requires publishing the source.
