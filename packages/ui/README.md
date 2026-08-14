# @opusline/ui

The Opusline design system: shadcn/ui-style components on Base UI primitives,
Tailwind v4 (CSS-first config in `src/styles/globals.css`), Lucide icons.

Exports raw TypeScript source — no build step; consumers compile it and must
`@source` this package in their Tailwind entry. Import as
`@opusline/ui/components/*`, `@opusline/ui/lib/*`, `@opusline/ui/hooks/*`,
`@opusline/ui/globals.css`.

Every component has a colocated story, served by `apps/storybook`
(`pnpm --filter @opusline/storybook dev`).
