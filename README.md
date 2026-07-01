<div align="center">

# SnapCV

**Turn your résumé into a portfolio site in about 20 seconds.**

Free, open source, and yours to edit. Every portfolio lives at `yourname.snapcv.me`.

[**Live demo**](https://snapcv.me) · [**Contribute**](CONTRIBUTING.md) · [**Report an issue**](https://github.com/jamaljm/snapcv/issues)

![Stars](https://img.shields.io/github/stars/jamaljm/snapcv?style=flat&label=stars)
![Forks](https://img.shields.io/github/forks/jamaljm/snapcv?style=flat&label=forks)
![License](https://img.shields.io/github/license/jamaljm/snapcv)
![Version](https://img.shields.io/github/package-json/v/jamaljm/snapcv/main)

</div>

Upload a résumé (or paste a LinkedIn URL) → an AI backend structures it → you get
a hosted portfolio *and* a clean résumé page. No blank canvas, no paywall, no
template smell.

> Coming from **read.cv** or **Bento** (both shutting down)? SnapCV is a free,
> open-source home for your profile.

If SnapCV is useful to you, a ⭐ helps other people find it.

## Features

- **AI-driven portfolio creation**: upload a résumé PDF, get a polished portfolio.
- **Custom subdomains**: every portfolio lives at `name.snapcv.me`.
- **Résumé + portfolio views**, GitHub Wrapped, drag-to-reorder skills, themes.
- **Open source**: contributions welcome.

## Tech stack

- **Frontend:** Next.js (App Router), Tailwind CSS, NextUI, Supabase (auth + DB + storage)
- **Backend:** Node.js + Express, OpenAI (résumé → structured JSON), `pdf-parse`

## Repository layout

```
snapcv/
├─ src/            # Next.js frontend (app, components, lib)
├─ backend/        # Node/Express service: résumé PDF → structured JSON (see backend/README.md)
├─ .env.example    # frontend env template
└─ README.md
```

## Getting started

### Prerequisites

- Node.js **>= 20** and npm
- A free [Supabase](https://supabase.com/) project
- An [OpenAI API key](https://platform.openai.com/) (for the backend)

### 1. Clone

```bash
git clone https://github.com/jamaljm/snapcv.git
cd snapcv
```

### 2. Set up Supabase

1. Create a Supabase project. From **Project Settings → API**, copy the project
   URL and the `anon` key.
2. **Auth → Providers → Google:** enable Google sign-in.
3. **SQL editor:** create the `users` table (portfolios are public read; owners
   write their own row):

   ```sql
   create table public.users (
     id          uuid primary key,          -- Supabase auth user id
     "userId"    uuid,                       -- auth user id (used by some queries)
     "userName"  text unique not null,       -- the subdomain / slug
     "userEmail" text,
     "resumeJson" jsonb,
     "metaJson"   jsonb,
     "githubWrap" jsonb,
     "updatedAt"  timestamptz default now()
   );

   alter table public.users enable row level security;
   create policy "public read"  on public.users for select using (true);
   create policy "owner insert" on public.users for insert with check (auth.uid() = id);
   create policy "owner update" on public.users for update using (auth.uid() = id);
   ```

4. **Storage:** create two buckets — `resume` (uploaded PDFs) and `snapcv`
   (portfolio images). Make them public-read for local dev.

### 3. Run the backend (résumé extraction)

```bash
cd backend
npm install
cp .env.example .env      # set OPENAI_KEY
npm run dev               # http://localhost:5000
```

See [`backend/README.md`](backend/README.md) for details.

### 4. Run the frontend

```bash
# from the repo root
npm install
cp .env.example .env.local  # fill in Supabase + backend URL
npm run dev                 # http://localhost:3000
```

> Local note: portfolios render by subdomain (`name.snapcv.me`). On `localhost`
> you'll see the landing/marketing site; use the editor at `/create` and `/home`.

## Environment variables (frontend)

| Variable                        | Required | Description                                        |
| ------------------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | yes      | Supabase project URL.                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes      | Supabase anon key (client).                        |
| `SUPABASE_ANON_KEY`             | yes      | Key used by server-side API routes.                |
| `NEXT_PUBLIC_API_BASE_URL`      | yes      | Base URL for the app's own `/api` routes.          |
| `NEXT_PUBLIC_BACKEND`           | yes      | URL of the résumé-extraction backend (`/backend`). |
| `GITHUB_TOKEN`                  | no       | Server-side token for the GitHub Wrapped feature.  |

## Contributing

1. Fork the repo and create a feature branch.
2. Make your changes with clear commit messages (`next build` + `next lint` should pass).
3. Open a pull request against `staging`.

Bugs and ideas: open an [issue](https://github.com/jamaljm/snapcv/issues).

## License

[AGPL-3.0](LICENSE). Network use is distribution — if you run a modified version
as a service, you must make your source available under the same license.

## Contact

Questions? Email [jamalvga2002@gmail.com](mailto:jamalvga2002@gmail.com).
