# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Opusline** — open-source (AGPL-3.0) time tracking, notes, and mission management for freelancers. Self-hostable alternative to Kimai, freelance-first: missions, clients, CRA, TJM, notes, invoicing.

## Monorepo layout

pnpm workspaces + Turborepo. JS tooling via pnpm, PHP via Composer (independent).

```
apps/
  api/        # Laravel API (PHP). Composer-managed. npm scripts wrap artisan.
  web/        # Product SPA — Vite + React + TypeScript + TanStack Router/Query
packages/
  ui/         # Design system — shadcn/ui components + Storybook
  api-types/  # TS types generated from the Laravel OpenAPI spec
```

## Commands

Run from the repo root unless stated otherwise.

```bash
pnpm install              # install all JS workspaces
turbo dev                 # start api (artisan serve) + web (vite) together
turbo build               # build everything
turbo test                # Pest (api) + Vitest (js packages)
turbo lint                # Biome (js) + Pint (php)

# Scoped
pnpm --filter @opusline/web dev
pnpm --filter @opusline/ui storybook

# Laravel (from apps/api/)
php artisan test
vendor/bin/pint
```

## Stack decisions (do not re-litigate)

- **Frontend**: Vite SPA with **TanStack Router** (file-based routes) + **TanStack Query**. NOT TanStack Start, NOT Next.js — no SSR, no second server runtime. Self-hosting simplicity is a core product value: `web` builds to static files.
- **UI**: shadcn/ui on **Base UI** primitives (not Radix). Components live in `packages/ui`, imported as `@opusline/ui`. Icons: **Lucide** only.
- **Styling**: Tailwind v4 (CSS-first config, `@theme` tokens, no tailwind.config.js). Design system is defined by shadcn preset `b4DLSOvBaa` (style mira, base stone, theme amber, heading font Lora, body Geist, radius default). See DESIGN.md if present.
- **API**: Laravel. **spatie/laravel-data** for DTOs at the boundaries (validation in, serialization out); plain Eloquent in the middle. Vanilla Laravel structure with domain folders under `app/Domain/` (Tracking, Clients, Notes, Billing) — NOT nwidart/laravel-modules.
- **API contract**: OpenAPI spec generated from the API → TypeScript types in `packages/api-types`. Regenerate types after changing API request/response shapes.
- **Package boundary**: `packages/ui` exports raw TS source (no build step); consumers compile it. Tailwind in consumers must `@source` the ui package.

## Conventions

- **Commits**: Conventional Commits, enforced by commitlint via Lefthook. Types: feat, fix, refactor, perf, style, test, docs, build, ci, chore, revert. Scopes (closed list): `api`, `web`, `ui`, `website`, `types`, `deps`, `repo`. Subject: imperative, lowercase, ≤50 chars, no trailing period. Body explains the WHY.
- **Hooks**: single `lefthook.yml` at root. Pre-commit runs Biome (staged JS/TS) and Pint (staged PHP). Don't add Turbo tasks to pre-commit.
- **Formatting/linting JS**: Biome (root biome.json). No ESLint, no Prettier.
- **PHP style**: Pint, Laravel preset.
- **TypeScript**: strict. No `any` without justification. Prefer inferred types over redundant annotations.
- **Language**: code, comments, commits, and docs in English. UI copy may have French strings (target market includes FR freelances) — keep user-facing strings ready for i18n, don't hardcode.

## Code style preferences

- Prefer clean, idiomatic, structural solutions over convention-dependent workarounds or clever hacks.
- Small composable components; shadcn-style composition (CVA variants, compound components) in `packages/ui`.
- **Tailwind: never use arbitrary pixel values** (`text-[17px]`, `w-[38px]`, `rounded-[2px]`). Always use tokens from the Tailwind scale; when translating designs, map px specs to the NEAREST Tailwind step (14.5px → `text-sm`, 12.5px → `text-xs`) — spacing can usually hit exact values via quarter-step tokens (`py-3.75` = 15px), font sizes cannot, so pick the closest, never the next step up. (Generated shadcn components keep their upstream styles.)
- **Design-system first.** When a design calls for a size, variant, or style a `packages/ui` component doesn't offer, extend the component (new CVA variant + updated story) — never patch it at the call site with utility-class overrides like `<Button className="h-9 px-4">`. Call-site classNames are for layout/context (margins, grid placement), not for reshaping components. If a composition recurs across features, promote it into the design system.
- **Color tokens mirror the design canvas 1:1.** The canvas and the theme (`packages/ui/src/styles/globals.css`) share the same shadcn-style vocabulary: shadcn's base names carry the design's values (`muted` is the sunken tier, `accent` the hover tier, `destructive` the warm tone), extended with numbered tiers — surfaces (`card-2`, `secondary-2`, `muted-2`), borders (`border-2`…`border-5`), foreground ladder (`foreground-hi`, `foreground-2/3/4`), muted ladder (`muted-foreground-2`…`-7`), and accents (`primary-text`, `primary-text-strong`, `primary-note`, `link`, `link-hover`, `success`). Client/mission identification colors come from the deliberately desaturated `palette-*` tokens (`palette-amber` … `palette-stone`, one per `Color` enum case) — never from Tailwind's raw palette. A design `var(--x)` maps to the identically-named token — never approximate with opacity washes or a neighboring role.
- Accessibility is not optional: proper ARIA, focus management, keyboard navigation on all interactive components.
- On the API: thin controllers, logic in domain actions; Data classes validate explicitly on anything security-relevant (don't rely on inferred validation rules).
- Avoid premature abstraction. This is a solo-maintained OSS project — boring, readable code beats architecture astronautics.
- **Comments are the exception, not the habit.** The default for a new line of code is no comment. Write code that explains itself — good names, small functions, early returns — and reach for a comment only when the code genuinely cannot carry the information.
  - **A comment that describes _what_ the code does is a refactor waiting to happen.** Extract the block into a function whose name says it, or rename the variable, then delete the comment. `// find the mission the timer is on` above a `.find()` becomes `findMissionById(...)`.
  - **Comment the _why_ only when it is not recoverable from the code**: a non-obvious trade-off, a workaround for an external bug, a rule that came from the product or the design, a constraint enforced somewhere else in the stack. That is information the reader cannot deduce, so it earns its lines.
  - **Do not narrate your own work.** No comments explaining a change you just made, restating a prop's type, or labelling the obvious step of a function. If every branch of a component has a comment above it, the component is doing too much or is named badly — fix that instead.
  - Docblocks on exported functions/components carry the same bar: skip them when the signature already says everything (`formatClock(seconds): string`). Write one when there is a real caveat, unit, or precondition to state.

## Things NOT to do

- Don't add SSR, server functions, or a Node backend to `web`.
- Don't swap Base UI for Radix (or vice versa) in individual components — the repo is Base UI everywhere.
- Don't introduce localStorage-based state for anything important; server state belongs in TanStack Query, ephemeral UI state in React state.
- Don't install alternative UI/icon/styling libraries (MUI, styled-components, react-icons, etc.).
- Don't edit generated files: `packages/api-types/src/generated/`, TanStack Router's `routeTree.gen.ts`.
- Don't commit directly — always leave commits to the human unless explicitly asked.

## Testing

- API: Pest. Feature tests for endpoints (happy path + validation errors + authorization), unit tests for domain actions.
- Web: Vitest + Testing Library for components with logic; don't test trivial rendering.
- Storybook (`apps/storybook`, serves both workspaces): **every component in `packages/ui` AND `apps/web` gets a story**, colocated next to the component (`PascalCase.stories.tsx`, CSF3 `satisfies Meta`, `tags: ["autodocs"]`, title prefix `UI/` or `Web/`). Stories double as visual documentation; a component without a story is not done. Exception: TanStack Router route files (`src/routes/**`) are thin wiring — the feature component they render carries the story.

## When unsure

Prefer asking over guessing on: product decisions (features, UX flows), anything touching billing/invoice math, database schema changes, and licensing/dependency additions (AGPL compatibility matters).