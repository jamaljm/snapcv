# Changelog

All notable changes to SnapCV are documented here. This project follows
[Semantic Versioning](https://semver.org/). Features land on `staging` and are
released to production when `staging` is merged to `main`.

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
