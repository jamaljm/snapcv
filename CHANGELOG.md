# Changelog

All notable changes to SnapCV are documented here. This project follows
[Semantic Versioning](https://semver.org/). Features land on `staging` and are
released to production when `staging` is merged to `main`.

## [2.12.2] — Dark-mode + sleeker README badge

### Changed
- The GitHub README card now has a **dark variant** (`?theme=dark`) that matches
  GitHub's dark UI (near-black `#0d1117`, inverted avatar, GitHub-dark text), and
  the badge snippet is now a `<picture>` element so the card **auto-switches to the
  viewer's light/dark theme**. Refined the card design (rounder corners, tighter
  type, better spacing) and the badge page now previews both modes. Card image
  served from the non-redirecting `www` host.

## [2.12.1] — Surface the GitHub badge in the dashboard

### Added
- A "GitHub badge" link in the editor dashboard nav (next to the portfolio URL)
  pointing to `/badge/{username}`, so every owner discovers the README card and
  can plant it on their GitHub profile. Closes the discovery gap that kept the
  embed loop from firing.

## [2.12.0] — GitHub README badge (the embed loop)

### Added
- An **embeddable portfolio card** for GitHub profile READMEs — the growth loop
  where a portfolio recruits strangers, not just its own viewers. New
  `/api/card/{username}` returns a clean monochrome SVG (name, role, top skills,
  `{username}.snapcv.me` + SnapCV mark), cached for GitHub's image proxy. A public
  `/badge/{username}` page shows a live preview, the one-line copy-paste markdown
  (`[![...](/api/card/user)](https://user.snapcv.me)`), and setup steps. Same
  self-referring mechanic that took github-readme-stats to ~80k stars, pointed at
  SnapCV's funnel. (Next: surface the badge link in the owner's dashboard.)

## [2.11.0] — Claim-your-preview flow (try → signup → your portfolio)

### Added
- The `/try` preview now closes the loop into signup. The banner makes it clear
  it's a live, editable preview ("Sign up to save it and edit every section"),
  and the CTA ("Claim & edit yours, free") carries the previewed GitHub username
  through Google sign-in (via localStorage, surviving the OAuth round-trip). On
  `/create`, that username is pre-filled and the GitHub tab is opened, so a
  claimed preview becomes the person's real portfolio in one click, with no
  retyping. This is the conversion path from a shared preview link to an owned
  portfolio.

## [2.10.5] — Fix clipped create-flow tabs

### Fixed
- On the create page, the first source tab was labeled "Enter linkedIn profile",
  which was long enough to push the third tab ("Upload resume") off-screen. The
  three tabs are now short, even, and consistent: **LinkedIn / GitHub / Resume**,
  so all three fit and are fully visible.

## [2.10.4] — Activity graph shows last 6 months on mobile

### Changed
- On mobile, the contribution graph now shows the most recent ~6 months (26
  weeks) instead of the full year, so the cells stay a legible size instead of
  shrinking to fit 53 weeks. Desktop still shows the full year. A "Last 6 months"
  caption appears on mobile; the headline count stays the full-year total.

## [2.10.3] — Activity graph fits mobile (no horizontal scroll)

### Fixed
- The contribution graph used fixed-pixel cells, so on mobile you had to scroll
  sideways to see the full year. The grid now scales to its container (week
  columns flex to fill the width, cells stay square via `aspect-square`), so the
  entire year fits with no horizontal scroll on any screen, phone to desktop.

## [2.10.2] — Fix: activity graph hidden when GitHub username field is empty

### Fixed
- The contribution graph derived the GitHub handle from `profile.username` and
  required an exact `"GitHub"` network label, so portfolios that stored only the
  GitHub **URL** (empty username field) or a different casing never rendered the
  graph — even with a linked GitHub and plenty of contributions. Now it matches
  the network case-insensitively (or any `github.com` URL) and falls back to
  parsing the handle from the URL. Verified against the real data shapes.

## [2.10.1] — Contribution graph works without a token (+ design polish)

### Changed
- The portfolio activity graph now sources its data from a public, **tokenless**
  GitHub contributions API instead of GitHub's GraphQL (which required a
  `GITHUB_TOKEN` that kept expiring and silently hid the graph for everyone).
  `/api/githubActivity` no longer needs any token; the grid aligns to Sunday and
  still falls back to empty on any failure. Verified end-to-end with real data.
- **Design**: the graph now sits in a bordered card that matches the portfolio's
  project cards, sized to fit the column (the full year fits without scrolling),
  with a centered "N contributions this year" header and a subtle cell ring.

## [2.10.0] — SEO / AEO / GEO hardening

### Changed
- **Portfolio structured data** rewritten from a loose `Person` (with invalid,
  ignored properties and the user's external URL as canonical) into a proper
  `ProfilePage` → `Person` using only valid schema.org fields (`knowsAbout`,
  `alumniOf`, `worksFor`, `jobTitle`, `address`, `sameAs`), with the snapcv page
  as the canonical `@id`/`url`. This is what search + AI answer engines parse to
  understand and cite a person (AEO/GEO).
- **Per-portfolio metadata**: title now includes the role (`Name · Role`) for a
  richer SERP snippet, an explicit `canonical` is set, a description fallback is
  added when the bio is empty, and the Twitter card gets a description.

### Added
- **`llms.txt`** describing SnapCV for LLM crawlers (emerging AEO/GEO convention).

### Fixed
- Résumé **Skills** section rendered one bold label per line when skills were
  stored as bare names (no keywords) — the common shape — leaving a tall, empty
  column. Now only groups that actually carry keywords use the aligned grid;
  keyword-less skills collapse into a single compact, wrapping line.

## [2.9.0] — World-class résumé template

### Changed
- Rebuilt the résumé (`ResumeContent`, shared by `/resume` and the editor preview)
  into a minimal, top-tier professional one-pager:
  - **Flush-left letterhead** with a single strong anchor rule; every other rule is
    a hairline. "Open to work" is now a quiet small-caps marker, not a pill.
  - **True monochrome** via the pure `neutral` scale (no blue-tinted grays), with a
    deliberate ink ramp for name/body/meta/hairlines.
  - **Two-tier entries** (role + right-aligned tabular-nums dates on top, company +
    location beneath) wrapped in `break-inside-avoid` so a job never splits across
    PDF pages.
  - **Skills as an aligned definition grid** (label column + keyword column line up);
    proficiency shown as print-safe text glyphs, not colored dots.
  - Denser education (one-line "Coursework:"), print-honest bare link URLs, and
    consistent section rhythm. Clean sans typography; ATS-safe single-column DOM.

## [2.8.0] — GitHub contribution graph on the portfolio

### Added
- Portfolios with a linked GitHub now show a **contribution activity graph**
  (the green square grid + "N contributions this year") — the strongest at-a-glance
  proof-of-work for a recruiter's 90-second scan. New `/api/githubActivity` route
  (GraphQL `contributionCalendar`) + a self-contained client component (no new deps).
- **Honesty gate**: the graph only renders when contributions clear a threshold
  (150/yr), so a sparse account is never made to look inactive. Any failure (no
  token, unknown user, rate limit) silently renders nothing.

## [2.7.1] — Fix invalid sitemap URLs (Search Console)

### Fixed
- The sitemap emitted usernames verbatim as subdomains, so accounts whose
  `userName` had spaces (`siri chandana`) or held legacy garbage (a full Wix URL)
  produced invalid entries that Google Search Console rejected ("Invalid URL",
  "URL not allowed"). The sitemap now only emits DNS-valid subdomain labels
  (`[a-z0-9-]`, 1–63 chars, no leading/trailing hyphen), silently skipping the rest.

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
