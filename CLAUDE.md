# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Opusline** — open-source (AGPL-3.0) time tracking, notes, and mission management for freelancers. Self-hostable alternative to Kimai, freelance-first: missions, clients, CRA, TJM, notes, invoicing.

## Monorepo layout

pnpm workspaces + Turborepo. JS tooling via pnpm, PHP via Composer (independent).

```
apps/
  api/        # Laravel API (PHP). Composer-managed; PHP runs ONLY in Docker via scripts/php.sh.
  web/        # Product SPA — Vite + React + TypeScript + TanStack Router/Query
  storybook/  # Storybook host — serves the stories of packages/ui AND apps/web
packages/
  ui/         # Design system — shadcn/ui components (raw TS source, no build step)
  api-client/ # TS client generated from the Laravel OpenAPI spec (flat into src/, incl. index.ts)
docker/       # Production image bits: the API entrypoint and the web Caddyfile
```

Deployment lives at the root: `Dockerfile` (targets `api` and `web`),
`compose.prod.yaml`, `.env.production.example`, `docs/self-hosting.md`. Do not
confuse `apps/api/compose.yaml` with it — that is the development Sail stack,
which builds from the host's `vendor/` and bind-mounts the repository.

## Commands

Run from the repo root unless stated otherwise.

```bash
pnpm install              # install all JS workspaces (also installs the git hooks)
turbo dev                 # api (Sail stack + Octane/FrankenPHP via apps/api/scripts/dev.sh)
                          #   + web (Vite on :3000, proxying /api and /sanctum to the container)
                          #   + storybook (:6006)
turbo build               # build everything
turbo test                # Pest (api, inside Docker) + Vitest (web, storybook story tests)
turbo lint                # PHP only: Pint --test + Rector --dry-run (inside Docker)
pnpm format-and-lint      # Biome across the repo (root //#format-and-lint task; :fix writes)
pnpm generate-api         # export OpenAPI spec + regenerate packages/api-client

# Scoped
pnpm --filter @opusline/web dev
pnpm --filter @opusline/storybook dev

# PHP — never on the host. The single door is the Docker wrapper (from apps/api/):
sh scripts/php.sh php artisan test
sh scripts/php.sh php vendor/bin/pint
```

## Stack decisions (do not re-litigate)

- **Frontend**: Vite SPA with **TanStack Router** (file-based routes) + **TanStack Query**. NOT TanStack Start, NOT Next.js — no SSR, no second server runtime. Self-hosting simplicity is a core product value: `web` builds to static files.
- **UI**: shadcn/ui on **Base UI** primitives (not Radix). Components live in `packages/ui`, imported as `@opusline/ui`. Icons: **Lucide** only.
- **Styling**: Tailwind v4 (CSS-first config, `@theme` tokens, no tailwind.config.js). Design system is defined by shadcn preset `b4DLSOvBaa` (style mira, base stone, theme amber, heading font Lora, body Geist, radius default).
- **API**: Laravel. **spatie/laravel-data** for DTOs at the boundaries (validation in, serialization out); plain Eloquent in the middle. Vanilla Laravel structure with domain folders under `app/Domain/` (Tracking, Clients, Notes, Billing) — NOT nwidart/laravel-modules.
- **API contract**: OpenAPI spec generated from the API (`apps/api/openapi.json`) → typed client in `packages/api-client` (hey-api, generated flat into `src/` including `index.ts`). Regenerate after changing API request/response shapes (`pnpm generate-api`). The generated TypeScript types ARE the contract: runtime zod validation (`@opusline/api-client/zod`) is used only for form *input* validation, never at API response boundaries — deliberate decision, do not add response parsing/validation.
- **Package boundary**: `packages/ui` exports raw TS source (no build step); consumers compile it. Tailwind in consumers must `@source` the ui package.

## Conventions

- **Commits**: Conventional Commits, enforced by commitlint via Lefthook. Types: feat, fix, refactor, perf, style, test, docs, build, ci, chore, revert. Scopes (closed list): `api`, `web`, `ui`, `storybook`, `deps`, `repo`. Subject: imperative, lowercase, ≤50 chars (encoded in `commitlint.config.mjs`, so the PR title check enforces it too), no trailing period. Body explains the WHY.
- **Hooks**: single `lefthook.yml` at root. Pre-commit runs Biome (staged JS/TS/JSON/CSS) and, on staged PHP, Rector then Pint — all auto-fix and re-stage. Commit-msg runs commitlint. Pre-push, in order: regenerates the OpenAPI spec, then the API client, route tree and compiled message catalogs, failing on drift in any of them (`scripts/generated-artifacts.sh`); `i18n-guard`; `release-notes-guard`; then `turbo run test check-types lint` filtered to `@opusline/api`, and `turbo run build test check-types lint format-and-lint` across everything. Don't add Turbo tasks to pre-commit.
- **Formatting/linting JS**: Biome (`biome.jsonc` at the root, extended by `apps/web`, `apps/api`, `packages/api-client`). No ESLint, no Prettier.
- **PHP style**: Pint (Laravel preset) + Rector; both run through the Docker wrapper.
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

## i18n

- Two languages, `en` (default and fallback for unknown browsers) and `fr`, both driven by `user_settings.locale` end to end.
- **Web**: UI copy lives in `apps/web/messages/{en,fr}.json` (Paraglide; the compiled output in `apps/web/src/paraglide` is committed and drift-checked — regenerate with `pnpm --filter @opusline/web generate-messages`). Call `m.key()` at render time; **never** assign `m.key()` to a module-level const (it freezes the boot locale), and module-level zod schemas take lazy errors (`error: () => m.key()`). Counts use plural-variant messages, interpolation uses `{param}` messages — never glue translated fragments. Enum labels are `Record<Enum, () => string>` maps behind accessor functions. `Intl` formatters go through `cachedFormatter`/`cachedDateFormatter` with the locale threaded as the first parameter; numeric date layouts follow the user's `DateFormat`, not the locale.
- **API**: messages live in `lang/{en,fr}` domain groups with exact key parity (guarded by `tests/Unit/LangCatalogTest.php`). Never add keys to the laravel-lang-managed files (`validation`, `auth`, `http-statuses`, `passwords`, `pagination`, the root JSON files) — `lang:update` prunes foreign keys on every composer update; use a domain group (`rules.php`, `fields.php`, …). Never memoize `__()` output in statics — Octane workers would freeze the first request's locale (see `FrenchHolidays`).
- French fiscal vocabulary stays French in both languages: CRA, SIRET, TJM, URSSAF, ACRE, HT/TTC, CA3/CA12, « Franchise en base »… The CRA document (PDF and its web preview `cra-document.tsx`) is a French artifact and stays entirely French.
- `scripts/i18n-guard.sh` (CI + pre-push) fails the build on accented literals outside the catalogs.

## Things NOT to do

- Don't add SSR, server functions, or a Node backend to `web`.
- Don't swap Base UI for Radix (or vice versa) in individual components — the repo is Base UI everywhere.
- Don't introduce localStorage-based state for anything important; server state belongs in TanStack Query, ephemeral UI state in React state.
- Don't install alternative UI/icon/styling libraries (MUI, styled-components, react-icons, etc.).
- Don't edit generated files. `scripts/generated-artifacts.sh` is the canonical list, and it is the list — do not keep a second copy here that can drift from it. As of writing it guards four paths, the easiest to hand-edit by accident being the committed `apps/web/src/paraglide` output.
- Don't commit directly — always leave commits to the human unless explicitly asked.

## Testing

- API: Pest. Feature tests for endpoints (happy path + validation errors + authorization), unit tests for domain actions.
- Web: Vitest + Testing Library for components with logic; don't test trivial rendering.
- **Fixture and demo names are fiction.** Every client, company, brand, and mission name in seeders, tests, stories, and fixtures must be invented — never the name of a real business, and never copied from a design mockup without checking (mockups have carried real names). Reuse the established fictional cast (Nordlys, Callisto, Lunaprint, Orvella, Vesterhus, Studio Lorem, Ateliers Ruche, Perso…) before coining new members, so the demo reads as one coherent world.
- Storybook (`apps/storybook`, serves both workspaces): **every component in `packages/ui` AND `apps/web` gets a story**, colocated next to the component (`PascalCase.stories.tsx`, CSF3 `satisfies Meta`, `tags: ["autodocs"]`, title prefix `UI/` or `Web/`). Stories double as visual documentation; a component without a story is not done. Exceptions: TanStack Router route files (`src/routes/**`) are thin wiring — the feature component they render carries the story; context-provider components and story-only helpers have no visual surface of their own and need no story.

## When unsure

Prefer asking over guessing on: product decisions (features, UX flows), anything touching billing/invoice math, database schema changes, and licensing/dependency additions (AGPL compatibility matters).