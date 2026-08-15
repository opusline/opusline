# Release-note fragments

Every user-facing PR ships the line users will read about it, changesets-style.
Fragments accumulate here between releases; when release-please opens its
release PR, run `node scripts/assemble-release-notes.mjs <version>` to fold
them into the in-app release notes
(`apps/web/src/lib/releases.ts`) and delete them.

Commit the assembled entry to `main` through its own PR — never to the
release-please branch, which the bot force-pushes on every push to `main`,
wiping anything committed there. Once the assembly lands on `main`, the bot
refreshes the release PR and the guard goes green.

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
