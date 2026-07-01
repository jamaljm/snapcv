# Changelog

All notable changes to SnapCV are documented here. This project follows
[Semantic Versioning](https://semver.org/). Features land on `staging` and are
released to production when `staging` is merged to `main`.

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
