#!/bin/sh
# Everything that has to be true before the first request, done once per boot.
#
# Only for the server. `docker run … php artisan key:generate --show` is the
# first thing the install guide asks for, and an entrypoint that migrated —
# or demanded the key it is being asked to generate — before every one-off
# command would make that impossible.
set -eu

case "$*" in
  *octane:start*) ;;
  *) exec "$@" ;;
esac

if [ -z "${APP_KEY:-}" ]; then
  echo "APP_KEY is empty. Generate one with:" >&2
  echo "  docker run --rm ghcr.io/opusline/opusline-api:latest php artisan key:generate --show" >&2
  echo "and put it in your .env — it is what decrypts existing sessions and cookies," >&2
  echo "so it must stay the same across upgrades." >&2
  exit 1
fi

# Migrations run here rather than as a separate step because a self-hoster's
# upgrade is `docker compose pull && docker compose up -d`, and a schema left
# behind by one release is the failure mode that story has to survive. Set
# OPUSLINE_SKIP_MIGRATIONS=1 to take it back into your own hands.
if [ "${OPUSLINE_SKIP_MIGRATIONS:-0}" != "1" ]; then
  php artisan migrate --force --no-interaction
fi

# Rebuilt every boot: the caches are keyed to the environment the container was
# handed, and that changes whenever the compose file does.
#
# No config:cache. Scramble's config holds a security-scheme object that
# `var_export` cannot round-trip, and under Octane the framework boots once per
# worker anyway — so the cache would buy a few milliseconds a day in exchange
# for a container that refuses to start.
php artisan route:cache
php artisan event:cache

# Extracting TTF metrics is what made the first CRA render after a boot take
# seconds inside a request; pay it here instead. Allowed to fail: a font
# problem should break CRA downloads, not the whole API.
php artisan cra:warm-pdf-fonts \
  || echo "WARN: dompdf font cache warm-up failed; the first CRA render will pay it." >&2

exec "$@"
