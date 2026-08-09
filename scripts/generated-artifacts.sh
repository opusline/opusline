#!/usr/bin/env sh
# Regenerates the committed artifacts derived from the OpenAPI spec and the
# route files, then fails if any of them moved. Shared by the pre-push hook and
# CI so the list of generated paths cannot rot in one place and not the other.
#
# Exporting the spec itself is the caller's job: the hook reaches PHP through
# Docker (apps/api/scripts/php.sh) and CI through its own host PHP, and merging
# those two doors would mean giving CI the whole compose stack.
set -eu

cd "$(dirname "$0")/.."

pnpm --filter @opusline/api-client generate
pnpm --filter @opusline/web generate-routes

if ! git diff --exit-code -- \
  apps/api/openapi.json \
  packages/api-client/src \
  apps/web/src/routeTree.gen.ts; then
  echo "Generated files are stale. The fresh output is already in your working tree — commit it, then push again." >&2
  exit 1
fi
