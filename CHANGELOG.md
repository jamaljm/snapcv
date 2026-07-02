# Changelog

All notable changes to SnapCV are documented here. This project follows
[Semantic Versioning](https://semver.org/). Features land on `staging` and are
released to production when `staging` is merged to `main`.

## [2.8.0] — GitHub contribution graph on the portfolio

### Added
- Portfolios with a linked GitHub now show a **contribution activity graph**
  (the green square grid + "N contributions this year") — the strongest at-a-glance
  proof-of-work for a recruiter's 90-second scan. New `/api/githubActivity` route
  (GraphQL `contributionCalendar`) + a self-contained client component (no new deps).
- **Honesty gate**: the graph only renders when contributions clear a threshold
  (150/yr), so a sparse account is never made to look inactive. Any failure (no
  token, unknown user, rate limit) silently renders nothing.

## [2.7.0] — AI recruiter cards for GitHub projects

### Added
- GitHub-built portfolios now get **AI-written, recruiter-legible project
  descriptions** (what it does / what was built + real tech stack), generated
  from each repo's README + metadata. Fixes the core problem for job-seekers:
  their repos have no READMEs/descriptions, and recruiters scan GitHub in ~90s.
  New backend `/github-cards` endpoint; the frontend fetches top-repo READMEs and
  enriches the projects, with graceful fallback to the raw description.
- A "readiness nudge" on the `/try` preview (e.g. "2/6 projects have a live demo
  — add links to rank higher"), so the output feels like a scored, improvable asset.

## [2.6.0] — No-signup GitHub preview (try before you sign up)

### Added
- `/try` and `/try/[username]`: enter a GitHub username and instantly see a live
  portfolio preview (no account needed), with a "claim yours" CTA. Removes the
  signup wall, a top conversion + launch lever. Fully client-verifiable (no DB).
- Extracted the GitHub-to-profile logic into `src/lib/github.ts`, shared by the
  create-flow API route and the preview page.

## [2.5.0] — Résumé PDF export

### Added
- **Download PDF** button on the résumé page. Fully client-side (browser
  print-to-PDF), so no server Chrome/Puppeteer is needed on Vercel or Azure.
  Produces crisp, selectable, ATS-parseable text (not a rasterized image). A
  print stylesheet isolates the résumé for a clean, paginated document.

## [2.4.4] — Fix broken GitHub-to-portfolio in prod

### Fixed
- `/api/githubToProfile` returned 502 for every username in production (the
  GITHUB_TOKEN is invalid/expired, or Vercel is rate-limited). It now retries
  unauthenticated when the token is rejected, so the GitHub create path works
  again. Verified with a deliberately invalid token.

## [2.4.3] — Fix OG card avatar on long names

### Fixed
- The OG share card avatar/initial box collapsed to zero when a name was long
  enough to wrap (missing flex-shrink:0 in Satori). Long-named users got a card
  with no avatar. Verified the box renders again.

## [2.4.2] — Fix /read-cv-alternative footer + AI-tell copy

### Fixed
- The alternative page reused the absolute-positioned landing Footer, which
  overlapped the content. Replaced with a static footer.
- Removed em dashes from that page and the README hero/features (they read as
  AI-generated).

## [2.4.1] — read.cv / Bento alternative landing page

### Added
- `/read-cv-alternative` — a high-intent SEO landing page for people whose
  read.cv/Bento profiles are going away, in SnapCV's monochrome look and human
  voice. Added to the sitemap.

## [2.4.0] — SEO & brand

### Added
- **Brand entity JSON-LD** on the landing (Organization + WebSite +
  SoftwareApplication/free) so Google associates `snapcv.me` with "SnapCV" — the
  signal that helps win the branded search vs. same-name competitors.
- **Dynamic sitemap** (`sitemap.ts`, hourly) listing every published portfolio +
  key routes, replacing the static 3-URL sitemap.
- **`robots.txt`** (allow crawl, disallow editor/API/auth, points to the sitemap).

### Changed
- OG share cards now render in the brand font (**Urbanist**) instead of the
  generic system font.
- Thin/incomplete portfolios are `noindex`ed (domain-quality / UGC-spam safety).

## [2.3.0] — GitHub → instant portfolio

### Added
- **Create from GitHub** — enter a GitHub username and get a starter portfolio
  from your public profile + top repos (projects, languages → skills, links). No
  résumé needed — the lowest-friction way to make a portfolio. New `/api/githubToProfile`
  route maps a GitHub user to the profile shape; a "GitHub" tab in the create flow.

## [2.2.0] — Share & Grow

### Added
- **Dynamic OG share images** — every portfolio link (`name.snapcv.me`) now
  unfurls into a sleek 1200×630 monochrome card (avatar, name, title, "open to
  work") on LinkedIn/X/WhatsApp/Slack. Generated at `/api/og`, matched to the
  résumé's black-and-white look.
- **"Made with SnapCV" badge** — a subtle, monochrome footer badge on hosted
  portfolios (referral loop; `?ref=badge` for attribution).

## [2.1.1] — Sleek monochrome résumé

### Changed
- The résumé is now **monochrome / black** instead of using the portfolio accent
  color — cleaner, more professional, and ATS-friendly. (The portfolio still uses
  the chosen accent color.)

## [2.1.0] — Resume redesign & richer profile data

### Added
- **Resume redesign** — accent color (from the portfolio color), skill pills with
  optional proficiency levels, cleaner project cards (tech pills, live/source
  links, no label prefixes), and testimonial cards.
- **Skill proficiency** — set a 1–5 level per skill group in the editor; rendered
  as level dots on the resume.
- **"Open to work" badge** — toggle in the editor with an optional custom label.
- **Richer testimonials** — references now support role, company, and avatar.
- **Custom social links** — any network (Behance, Medium, blog, …) renders with a
  generic link icon, not just the fixed five.

### Changed
- Deduplicated the two resume renderers into a shared `ResumeContent`, so the
  editor preview always matches the public `/resume` page.

### Notes
- All new profile fields are optional — existing portfolios render unchanged.

## [2.0.0] — Baseline
- AI resume-to-portfolio, subdomain hosting, GitHub Wrapped, portfolio counter.
