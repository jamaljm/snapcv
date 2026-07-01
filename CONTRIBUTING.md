# Contributing to SnapCV

Thanks for helping build SnapCV! Contributions of every size are welcome — bug
fixes, new résumé/portfolio templates, editor improvements, docs, and more.

## Getting started

1. Read the [README](README.md) to run the app locally (frontend + backend + Supabase).
2. For an overview of how the codebase fits together, see [CLAUDE.md](CLAUDE.md)
   (it's written for AI assistants but is a great human primer too).

## Workflow

- **Branch off `staging`** and open your PR **against `staging`** (not `main`).
  `main` is production; releases happen by merging `staging → main`.
- Use a descriptive branch name: `feat/…`, `fix/…`, or `docs/…`.
- Before opening a PR, make sure the build is clean:

  ```bash
  npm run build   # runs ESLint; must pass with no errors
  ```

- Write clear commit messages (imperative mood, e.g. "add PDF export").
- If your change is user-facing, add an entry to [CHANGELOG.md](CHANGELOG.md).

## Good first contributions

- New résumé or portfolio **templates** (the `meta.resumeTheme` / `meta.portfolioTheme`
  fields exist and are ready to switch on).
- **Accessibility** and mobile polish.
- Migrating raw `<img>` to `next/image` (hosts are allowlisted in `next.config.ts`).
- Docs and examples.

Look for issues labeled **good first issue** or **help wanted**.

## Reporting bugs & ideas

Open an [issue](https://github.com/jamaljm/snapcv/issues) with clear steps to
reproduce (for bugs) or the problem you're solving (for features).

## License

By contributing, you agree that your contributions are licensed under the
project's **AGPL-3.0** license.
