#!/usr/bin/env sh
# Reads a release-please PR body on stdin and succeeds when its changelog holds
# no section other than Dependencies. That is the one definition of a release
# that ships without a human: release-please.yml auto-merges the release PR on
# it and assemble-release-notes.yml the assembly PR, so keep the rule here.
set -eu

sections=$(tr -d '\r' | grep -E '^### ' | sort -u || true)
[ "$sections" = "### Dependencies" ]
