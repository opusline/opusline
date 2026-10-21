# Contributing

Opusline is solo-maintained. Contributions are welcome — bug reports, docs,
fixes, features — but for anything bigger than an obvious fix, **open an
issue first**. It costs a paragraph, and it prevents the worst outcome this
file exists to prevent: an evening spent on a PR the project cannot take.

Reviews happen around a freelance workload. Expect days, not hours; the
[code of conduct](CODE_OF_CONDUCT.md) says the rest.

## Setting up

You need Node.js 26 — the version in `.nvmrc`, which is the only one CI runs —
plus [pnpm](https://pnpm.io) and Docker. PHP is deliberately not on the list:
it only runs in containers, through `apps/api/scripts/php.sh`.

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

The Storybook tests and the end-to-end suite drive a headless Chromium; install
it once:

```bash
pnpm --filter @opusline/storybook exec playwright install chromium
```

## Where things live

| Path | What it is |
| --- | --- |
| `apps/api` | Laravel API — domain folders under `app/Domain/` |
| `apps/web` | The SPA — Vite, React, TanStack Router/Query |
| `apps/storybook` | Storybook host for both `packages/ui` and `apps/web` stories |
| `apps/e2e` | Playwright suite that browses the production images |
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

The end-to-end suite is the one check the hooks leave out, because it needs a
booted stack. It browses the production images — Caddy, FrankenPHP, Postgres —
under a compose project of its own, on port 8080, beside whatever `pnpm dev` has
running:

```bash
pnpm --filter @opusline/e2e stack:build   # both images, from your working tree (needs docker buildx)
pnpm --filter @opusline/e2e stack:up
pnpm e2e                                  # `pnpm --filter @opusline/e2e e2e:ui` to debug
pnpm --filter @opusline/e2e stack:down    # volumes included
```

Every test registers its own account and creates what it needs through the app,
so there is nothing to seed and no order to respect. The stack sends its email
to a Mailpit of its own, which the suite reads back over HTTP (and you can open
on http://localhost:8026). `E2E_BASE_URL=http://localhost:3000
pnpm e2e` points the same suite at `pnpm dev`; past a handful of tests that needs
`TRUSTED_PROXIES=*` in `apps/api/.env`, or the register limiter sees one visitor.

Behind a proxy that intercepts TLS, the image build cannot download its
dependencies until it trusts that proxy's CA: name the PEM file with
`E2E_BUILD_CA=/path/to/ca.pem pnpm --filter @opusline/e2e stack:build`. It is
passed as a BuildKit secret, so it never ends up in the images.

Two stacks on one Docker daemon, such as parallel clones, each need their own
`E2E_STACK_PROJECT`, `E2E_HTTP_PORT` and `E2E_MAILPIT_PORT`, set the same way
for `stack:up`, `stack:down` and the run. When the daemon's published ports
cannot be reached from where you run the suite, as in a sandbox,
`sh apps/e2e/scripts/stack.sh e2e` runs it in a Playwright container inside the
stack's network instead; extra arguments go to `playwright test`.

CI is narrower than the hooks: it runs only the lanes your diff touches, so a
frontend-only PR reports the backend jobs as *skipped*, and a docs-only PR skips
nearly everything. Skipped counts as passing — the lane table lives in the
`Changed areas` job at the top of `.github/workflows/ci.yml`.

## The hooks

`pnpm install` installed them. Pre-commit formats what you staged — Biome on
JS/TS, Rector then Pint on PHP — and re-stages the result. Commit-msg runs
commitlint. Pre-push regenerates the OpenAPI spec, the API client, the route
tree and the message catalogs, failing on drift in any of them, then runs knip
and the i18n, release-notes and compose-doc guards, then the same build, test
and lint battery CI does. It is slow on purpose: a push that survives it merges
green.

## Where the work is

The [Opusline roadmap](https://github.com/orgs/opusline/projects/1) is the
public backlog: every open issue is on it, with a status that says where it
stands.

| Status | Meaning |
| --- | --- |
| Triage | Filed, not read yet |
| Backlog | Worth doing, not committed — not a promise |
| Next | What follows the current work, in order |
| In progress | A PR exists |
| Done | Merged or closed |

Each fact about an issue lives in one place. The **type** (Bug, Feature, Task)
says what kind of work it is; **labels** say where it lives (`api`, `web`,
`ui`, `ci`, `docs`, `self-hosting`); the **Priority** and **Effort** fields in
the Project say how much it matters and how big it is; **milestones** group the
few issues behind a delivery goal. A big feature is a parent issue with
sub-issues, and the parent stays open until the whole thing ships.

To pick something up, comment on the issue so nobody starts the same work,
then open a PR that `Closes` it. `good first issue` marks what is approachable
without knowing the codebase; `needs-info` means the issue is waiting on its
reporter.

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

A branch has to be up to date with `main` before it can merge, so every push
to `main` brings the open PRs along with it — expect a merge commit you did
not write. Drafts, forks and PRs already conflicting with `main` are left
alone; those need you.

## How a release ships

release-please watches `main`. Every `feat`, `fix`, `perf`, `revert` or
`chore(deps)` commit makes it open, or refresh, a release PR carrying the
version bump and the changelog; merging that PR tags the release, publishes
the images and attaches the compose and env files. The same workflow folds
the pending `.release-notes/` fragments into the in-app notes and commits
them onto that PR, so the notes ship with the release they describe.

Dependabot's minor and patch groups need nobody: once the required checks
are green the bot merges them, and a release whose changelog holds nothing
but dependency bumps merges its release PR on its own. A release with a
`feat` or `fix` in it waits for a maintainer, and a major bump always waits.

## Questions

Open an issue — questions that seem obvious are explicitly welcome. If what
you found is a vulnerability, [SECURITY.md](SECURITY.md) tells you where to
send it instead, privately.

Contributions are licensed under [AGPL-3.0](LICENSE).
