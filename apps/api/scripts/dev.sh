#!/usr/bin/env sh
set -e

cd "$(dirname "$0")/.."

sh scripts/bootstrap.sh

cleanup() {
    trap - EXIT INT TERM
    kill "$sail_pid" 2>/dev/null || true
    vendor/bin/sail stop
}
trap cleanup EXIT INT TERM

vendor/bin/sail up &
sail_pid=$!
wait "$sail_pid"
