## What and why

<!-- What changes, and the reason it needed to. The diff shows the what; this is
     for the why a reviewer cannot read off it. -->

## Checklist

- [ ] The PR title is a conventional commit — it becomes the squashed commit,
      and release-please reads it. Scopes: `api`, `web`, `ui`, `storybook`,
      `deps`, `repo`.
- [ ] A `feat:` or `fix:` PR carries a fragment under `.release-notes/`
      ([why](../.release-notes/README.md)) — CI holds the release PR red without one.
- [ ] Anything with a visual surface has a story; anything with logic has a test.
- [ ] Generated files were regenerated rather than hand-edited
      (`scripts/generated-artifacts.sh` is the list).
