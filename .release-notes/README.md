# Release-note fragments

Every user-facing PR ships the line users will read about it, changesets-style.
Fragments accumulate here between releases. When release-please opens its
release PR, the `Release Please` workflow folds them into the in-app release
notes (`apps/web/src/lib/releases.ts`), deletes them, and commits the result
onto the release branch itself. The release PR's release-notes guard goes green
on that commit, and the entry reaches `main` inside the squashed release commit
— so nothing here is consumed until the release actually ships.

The version it assembles under is only what release-please predicts today, and
`main` can invalidate it: a `0.21.3` becomes a `0.22.0` the moment a `feat`
lands behind it, and fragments keep arriving after the notes were assembled.
release-please force-pushes its branch on every push to `main`, which is the
same event that re-runs the assembly, so the entry is simply rebuilt — and when
the branch was left alone, the assembler *reclaims* what it wrote before: every
entry above the last released version is unreleased and therefore still its to
rewrite. Watching the release PR change version is expected; nothing is ever
stranded on a version that never gets tagged.

**Fragments are the copy.** Because nothing is consumed until the release ships,
rewording a line means editing its fragment here, in a normal PR to `main`; the
next assembly picks up the new wording. Don't edit the entry on the release
branch — the next force-push wipes it.

The same fold can be run by hand:

```
node scripts/assemble-release-notes.mjs <version> [<last-released>]
```

It refuses a version at or below the last released one — those notes have
shipped and are frozen. The second argument overrides where "last released"
comes from, which is what the workflow passes: on the release branch
`.release-please-manifest.json` has already been bumped to the version being
released.

A release with no fragments pending — dependency bumps and other changes that
needed no sentence — gets one generic line instead, "Updated the third-party
libraries Opusline is built on.", so the guard can go green; it steps aside as
soon as a real line joins the release. When the release changelog holds nothing
but a Dependencies section the release PR merges on its own; anything else waits
for a maintainer.

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
