# Release-note fragments

Every user-facing PR ships the line users will read about it, changesets-style.
Fragments accumulate here between releases. When release-please opens its
release PR, the `Assemble Release Notes` workflow folds them into the in-app
release notes (`apps/web/src/lib/releases.ts`), deletes them, and opens an
assembly PR against `main`. That PR merges on its own once CI is green — every
fragment was already reviewed on the PR that added it — and the bot then
refreshes the release PR so its release-notes guard goes green.

The version it assembles under is only what release-please predicts today, and
`main` can invalidate it: a `0.21.3` becomes a `0.22.0` the moment a `feat`
lands behind it, and fragments keep arriving after the notes were assembled. So
there is a single `assemble-release-notes/pending` branch, rebuilt from `main`
every time, and the assembler *reclaims* what it wrote before — every entry
above the last released version in `.release-please-manifest.json` is unreleased
and therefore still editable. Watching the assembly PR change version is
expected; nothing is ever stranded on a version that never gets tagged.

Reclaiming is why hand edits stick. Once the assembly PR has merged, reword a
line or add a `headline` to the pending entry in a normal PR to `main` and later
re-assembly carries it through untouched — a headline keeps the exact lines you
wrote it on. Don't edit it before then: the pending branch is rebuilt from
`main`, and the release-please branch is force-pushed on every push to `main`,
so anything committed to either is wiped.

The same fold can be run by hand with
`node scripts/assemble-release-notes.mjs <version>`. It refuses a version at or
below the last released one — those notes have shipped and are frozen.

A release with no fragments pending — dependency bumps and other changes that
needed no sentence — gets one generic line instead, "Updated the third-party
libraries Opusline is built on.", so the guard can go green; it steps aside as
soon as a real line joins the release. When the release changelog holds nothing
but a Dependencies section the release PR merges on its own too; anything else
waits for a maintainer there.

One JSON file per note, named with a short descriptive slug:

```json
{ "kind": "new", "text": "CRA workflow: prepare, send and track your monthly activity report." }
```

- `kind` — `new` (feature), `improved` (existing behavior got better) or
  `fixed` (bug fix).
- `text` — one user-facing English sentence. Write for a freelancer reading
  the app's "Release notes" page, not for a developer reading a commit log.

CI requires a fragment on every PR whose conventional title type is `feat` or
`fix`. Add the `no-release-note` label instead when the change has no
user-visible surface.
