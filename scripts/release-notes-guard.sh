#!/usr/bin/env sh
# A release must ship curated in-app release notes: the version in
# .release-please-manifest.json needs a matching entry in the web app's
# releases module. Green during normal development (the last released version
# is already curated); goes red on the release-please PR until the pending
# .release-notes/ fragments are assembled with scripts/assemble-release-notes.mjs.
set -eu

cd "$(dirname "$0")/.."

releases_module="apps/web/src/lib/releases.ts"
version=$(sed -n 's/.*"\.": *"\([0-9.]*\)".*/\1/p' .release-please-manifest.json)

if [ -z "$version" ]; then
  echo "Could not read the version from .release-please-manifest.json" >&2
  exit 1
fi

if ! grep -q "version: \"$version\"" "$releases_module"; then
  echo "Release $version has no entry in $releases_module." >&2
  echo "Assemble the pending fragments before releasing: node scripts/assemble-release-notes.mjs $version" >&2
  exit 1
fi
