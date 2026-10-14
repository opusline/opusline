#!/usr/bin/env sh
# The single door to PHP: runs any command inside the Laravel container so no
# host PHP is ever required. Uses a fast `exec` when the stack is running and a
# one-off `run` container otherwise (works with the stack down, e.g. git hooks).
set -e

cd "$(dirname "$0")/.."

sh scripts/bootstrap.sh

export WWWUSER="${WWWUSER:-$(id -u)}"
export WWWGROUP="${WWWGROUP:-$(id -g)}"

# The running container is addressed by name with plain `docker`, not through
# `docker compose`: a socket proxy that only allows exec into named containers
# (sandboxed agents) refuses the image and container-ID calls compose makes.
project="${COMPOSE_PROJECT_NAME:-$(sed -n 's/^COMPOSE_PROJECT_NAME=//p' .env 2>/dev/null)}"
container="${project:-opusline-api}-laravel.test-1"

if [ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null)" = true ]; then
    exec docker exec -i -u "$WWWUSER" "$container" "$@"
fi

exec docker compose run --rm -T laravel.test "$@"
