# Contributing

Opusline is solo-maintained. Contributions are welcome — bug reports, docs,
fixes, features — but for anything bigger than an obvious fix, **open an
issue first**. It costs a paragraph, and it prevents the worst outcome this
file exists to prevent: an evening spent on a PR the project cannot take.

Reviews happen around a freelance workload. Expect days, not hours; the
[code of conduct](CODE_OF_CONDUCT.md) says the rest.

## Setting up

You need Node.js 22.12+ (or 20.19+), [pnpm](https://pnpm.io) and Docker. PHP
is deliberately not on the list — it only runs in containers, through
`apps/api/scripts/php.sh`.

```bash
git clone https://github.com/opusline/opusline.git
cd opusline
pnpm install   # JS workspaces + the git hooks
pnpm dev       # API (Docker stack), web on :3000, Storybook on :6006
```

The first `pnpm dev` bootstraps the API by itself — Composer install,
`.env`, app key — in a throwaway container. Once it is up, seed the demo
account:

```bash
cd apps/api && sh scripts/php.sh php artisan migrate --seed
```

then sign in at http://localhost:3000 as `test@example.com` / `password`.

The Storybook tests drive a headless Chromium; install it once:

```bash
pnpm --filter @opusline/storybook exec playwright install chromium
```

## Where things live

| Path | What it is |
| --- | --- |
| `apps/api` | Laravel API — domain folders under `app/Domain/` |
| `apps/web` | The SPA — Vite, React, TanStack Router/Query |
| `apps/storybook` | Storybook host for both `packages/ui` and `apps/web` stories |
| `packages/ui` | The design system — shadcn/ui on Base UI, raw TS source |
| `packages/api-client` | TS client generated from the API's OpenAPI spec |

## Running the checks

Everything CI runs, you can run locally:

```bash
pnpm test                  # Pest (in Docker) + Vitest
pnpm check-types           # tsc across the JS workspaces
pnpm format-and-lint       # Biome; `pnpm format-and-lint:fix` writes
pnpm exec turbo run lint   # PHP: Pint + Rector, dry-run, in Docker
pnpm generate-api          # after changing an API request/response shape
```

Any PHP command goes through the wrapper, from `apps/api/`:

```bash
sh scripts/php.sh php artisan test
```

## The hooks

`pnpm install` installed them. Pre-commit formats what you staged — Biome on
JS/TS, Rector then Pint on PHP — and re-stages the result. Commit-msg runs
commitlint. Pre-push regenerates the OpenAPI spec, the API client, the route
tree and the message catalogs, failing on drift in any of them, then runs
the same build, test and lint battery CI does. It is slow on purpose: a push
that survives it merges green.

## What a PR needs

- **A conventional title.** PRs are squash-merged, so the title becomes the
  commit and release-please reads it: imperative, lowercase, ≤50 chars,
  scope from the closed list `api`, `web`, `ui`, `storybook`, `deps`,
  `repo`.
- **A release-note fragment** on every `feat:` or `fix:` — one JSON file
  under [`.release-notes/`](.release-notes/README.md) carrying the sentence
  a freelancer will read in the app. CI holds the release red without one.
- **A story for anything with a visual surface, a test for anything with
  logic.** API endpoints get feature tests — happy path, validation errors,
  authorization; CI runs the suite against SQLite, MySQL and Postgres.
- **English in code, both languages in copy.** UI strings live in
  `apps/web/messages/{en,fr}.json`, API messages in `apps/api/lang/{en,fr}` with
  exact key parity; the i18n guard fails the push on accented literals
  outside the catalogs. French fiscal vocabulary — CRA, TJM, URSSAF — stays
  French in both languages.
- **No hand-edited generated files.** `scripts/generated-artifacts.sh` is
  the list of what gets regenerated instead.

## Questions

Open an issue — questions that seem obvious are explicitly welcome. If what
you found is a vulnerability, [SECURITY.md](SECURITY.md) tells you where to
send it instead, privately.

Contributions are licensed under [AGPL-3.0](LICENSE).
