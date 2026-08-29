#!/usr/bin/env sh
# docs/self-hosting.md embeds compose.prod.yaml in full for the people who
# paste it into Portainer or a NAS UI instead of curling it. This regenerates
# that block from the real file and fails when the two have drifted. Shared by
# the pre-push hook and CI, like generated-artifacts.sh.
set -eu

cd "$(dirname "$0")/.."

awk '
  /<!-- compose-prod-begin/ {
    print
    print "```yaml"
    while ((getline line < "compose.prod.yaml") > 0) print line
    close("compose.prod.yaml")
    print "```"
    skip = 1
    next
  }
  /<!-- compose-prod-end -->/ { skip = 0 }
  !skip
' docs/self-hosting.md > docs/self-hosting.md.tmp
mv docs/self-hosting.md.tmp docs/self-hosting.md

if ! git diff --exit-code -- docs/self-hosting.md; then
  echo "The compose file embedded in docs/self-hosting.md was stale. The fresh copy is already in your working tree — commit it, then push again." >&2
  exit 1
fi
