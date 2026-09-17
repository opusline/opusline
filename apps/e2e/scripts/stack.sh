#!/usr/bin/env sh
# The production stack the e2e suite browses, under its own compose project and
# its own .env, so neither a developer's real instance (project `opusline`, the
# root .env) nor the Sail stack (project `opusline-api`, port 80) is touched.
set -eu

cd "$(dirname "$0")/../../.."

STACK_DIR=apps/e2e/.stack
ENV_FILE="$STACK_DIR/.env"
STACK_URL=http://localhost:8080
API_IMAGE=ghcr.io/opusline/opusline-api:e2e
WEB_IMAGE=ghcr.io/opusline/opusline-web:e2e

compose() {
    docker compose -p opusline-e2e --project-directory "$STACK_DIR" -f compose.prod.yaml "$@"
}

set_env() {
    grep -q "^$1=" "$ENV_FILE" \
        || { echo "stack.sh: .env.production.example no longer defines $1" >&2; exit 1; }
    sed "s|^$1=.*|$1=$2|" "$ENV_FILE" > "$ENV_FILE.next"
    mv "$ENV_FILE.next" "$ENV_FILE"
}

# .env.production.example describes an instance behind TLS on its own domain. A
# browser on plain http://localhost drops Secure cookies and cookies scoped to
# another domain, and Sanctum only opens a session for a stateful domain.
write_env() {
    mkdir -p "$STACK_DIR"
    grep -v '^SESSION_DOMAIN=' .env.production.example > "$ENV_FILE"

    set_env APP_URL "$STACK_URL"
    set_env APP_KEY "$(docker run --rm "$API_IMAGE" php artisan key:generate --show)"
    set_env DB_PASSWORD e2e
    set_env SANCTUM_STATEFUL_DOMAINS "${STACK_URL#http://}"
    set_env SESSION_SECURE_COOKIE false
    set_env OCTANE_HTTPS false
    set_env REGISTRATION_ENABLED true
    # A settings save would otherwise queue a call to mon-entreprise.urssaf.fr.
    set_env MON_ENTREPRISE_ENABLED false
    echo "OPUSLINE_VERSION=e2e" >> "$ENV_FILE"
}

case "${1:-}" in
    build)
        # The Dockerfile pins its build stages with $BUILDPLATFORM, which only
        # BuildKit defines; the classic builder dies on the first FROM.
        docker buildx version > /dev/null 2>&1 \
            || { echo "stack.sh: the images need BuildKit — install the docker buildx plugin" >&2; exit 1; }
        docker buildx build --load --target api -t "$API_IMAGE" .
        docker buildx build --load --target web -t "$WEB_IMAGE" .
        ;;
    up)
        write_env
        compose up -d --wait --wait-timeout 180
        ;;
    down)
        compose down --volumes
        ;;
    logs)
        compose logs
        ;;
    *)
        echo "usage: stack.sh build|up|down|logs" >&2
        exit 1
        ;;
esac
