#!/usr/bin/env sh
set -e

cd "$(dirname "$0")/.."

sh scripts/bootstrap.sh

setsid sh scripts/dev-janitor.sh $$ &

exec vendor/bin/sail up --watch
