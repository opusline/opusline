#!/usr/bin/env sh
# docker/sandbox/Dockerfile is a copy of laravel/sail's runtime Dockerfile with
# one build argument added. When Sail ships a new runtime, this fails until the
# copy is re-derived from it and the hash below is updated.
set -e

cd "$(dirname "$0")/../.."

upstream="vendor/laravel/sail/runtimes/8.5/Dockerfile"
expected="fa103e7b3c1e5c098acc3dc11086996da0bf1e0ed653a869168ee9ffd5634849"  # laravel/sail v1.69.0

actual="$(sha256sum "$upstream" | cut -d' ' -f1)"

if [ "$actual" != "$expected" ]; then
    echo "docker/sandbox/Dockerfile was derived from another $upstream (sha256 $expected, now $actual)." >&2
    echo "Re-apply the EXTRA_CA_CERT addition to the new upstream and update docker/sandbox/check-upstream.sh." >&2
    exit 1
fi
