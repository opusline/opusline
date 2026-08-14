# @opusline/storybook

Storybook host for the whole repo: it serves the stories colocated with the
components of `packages/ui` (title prefix `UI/`) and `apps/web` (`Web/`).
It holds no stories of its own — only the Storybook configuration.

```bash
pnpm --filter @opusline/storybook dev              # Storybook on :6006
pnpm --filter @opusline/storybook build:storybook  # static build in storybook-static/
```
