#!/usr/bin/env sh
# The single door to PHP: runs any command inside the Laravel container so no
# host PHP is ever required. Uses a fast `exec` when the stack is running and a
# one-off `run` container otherwise (works with the stack down, e.g. git hooks).
set -e

cd "$(dirname "$0")/.."

sh scripts/bootstrap.sh

export WWWUSER="${WWWUSER:-$(id -u)}"
export WWWGROUP="${WWWGROUP:-$(id -g)}"

if docker compose ps --status running laravel.test 2>/dev/null | grep -q laravel.test; then
    exec docker compose exec -T -u "$WWWUSER" laravel.test "$@"
fi

exec docker compose run --rm -T laravel.test "$@"
