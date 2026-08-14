# Contributing

Opusline is a solo-maintained project — for anything non-trivial, open an
issue first. Proper contribution docs will come later.

- Branch off `main`. PRs are squash-merged: the PR title must be a valid
  Conventional Commit (scopes: `api`, `web`, `ui`, `storybook`, `deps`,
  `repo`).
- CI must be green; the pre-push hook runs the same checks locally. The
  Storybook suite drives a headless Chromium — install it once with
  `pnpm --filter @opusline/storybook exec playwright install chromium`.
- Contributions are licensed under [AGPL-3.0](LICENSE).
