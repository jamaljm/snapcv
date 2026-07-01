# SnapCV Backend

The backend service that powers [SnapCV](https://snapcv.me). It takes a résumé
**PDF** (by URL), extracts the text, and uses OpenAI to normalize it into the
structured JSON schema the SnapCV frontend renders into a portfolio.

## Stack

- Node.js (>= 20), Express, ES modules
- `openai` (gpt-4o-mini, JSON mode) for extraction
- `pdf-parse` for PDF text extraction

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in OPENAI_KEY
npm run dev            # nodemon, auto-reload
# or
npm start
```

### Environment variables

| Variable          | Required | Description                                                    |
| ----------------- | -------- | -------------------------------------------------------------- |
| `OPENAI_KEY`      | yes      | OpenAI API key. The server fails to boot without it.           |
| `PORT`            | no       | Listen port (default 5000). Most hosts inject this.            |
| `ALLOWED_ORIGINS` | no       | Comma-separated CORS origins (your frontend).                  |

## API

| Method | Route          | Body                          | Description                                    |
| ------ | -------------- | ----------------------------- | ---------------------------------------------- |
| GET    | `/health`      | —                             | Liveness check → `{ "status": "ok" }`.         |
| POST   | `/extract-pdf` | `{ "pdfUrl": "https://…" }`   | Download a PDF and extract structured résumé JSON. |

The `/extract-pdf` route is rate-limited (20 req/min/IP).

## Output schema

The extractor returns a JSON-Resume-style object (`basics`, `work`, `education`,
`projects`, `skills`, `awards`, `certificates`, `languages`, `interests`,
`references`, …) — see `openai.js` for the full shape. Missing fields come back
as empty strings/arrays so the structure is always complete.

## Security

- **SSRF protection** (`lib/url-guard.js`): only http/https URLs are fetched, and
  any host resolving to a private/reserved IP range is rejected.
- **Rate limiting** (`lib/rate-limit.js`) + 1 MB request body limit.
- Downloads are capped (15 MB) with a timeout and held in memory (no temp files).

## Deploy

Any Node host works (Render, Railway, Fly, Azure App Service, a VM, …). Set
`OPENAI_KEY` (and `ALLOWED_ORIGINS`) as environment variables, then run
`npm start`. Point the frontend's `NEXT_PUBLIC_BACKEND` at the deployed URL.

## License

AGPL-3.0 — see the [LICENSE](../LICENSE) in the repository root.
