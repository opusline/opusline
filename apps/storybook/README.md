# @opusline/storybook

Storybook host for the whole repo: it serves the stories colocated with the
components of `packages/ui` (title prefix `UI/`) and `apps/web` (`Web/`).
Its only own story is the design-token reference page
(`src/stories/Tokens.stories.tsx`); everything else lives with its component.

```bash
pnpm --filter @opusline/storybook dev              # Storybook on :6006
pnpm --filter @opusline/storybook build:storybook  # static build in storybook-static/
```
