#!/usr/bin/env sh
# The production stack the e2e suite browses, under its own compose project and
# its own .env, so neither a developer's real instance (project `opusline`, the
# root .env) nor the Sail stack (project `opusline-api`, port 80) is touched.
#
# Two stacks sharing one Docker daemon (parallel clones) each pick their own
# E2E_STACK_PROJECT, E2E_HTTP_PORT and E2E_MAILPIT_PORT. Where the daemon's
# published ports are out of reach (a sandbox), `stack.sh e2e` runs the suite in
# a Playwright container inside the stack's network instead of from the host.
set -eu

cd "$(dirname "$0")/../../.."

STACK_DIR=apps/e2e/.stack
ENV_FILE="$STACK_DIR/.env"
STACK_PROJECT="${E2E_STACK_PROJECT:-opusline-e2e}"
HTTP_PORT="${E2E_HTTP_PORT:-8080}"
MAILPIT_PORT="${E2E_MAILPIT_PORT:-8026}"
STACK_URL="http://localhost:$HTTP_PORT"
API_IMAGE=ghcr.io/opusline/opusline-api:e2e
WEB_IMAGE=ghcr.io/opusline/opusline-web:e2e

# The ports ride the environment rather than the .env: in compose interpolation
# the shell wins, so `down` and `logs` agree with `up` whatever the .env holds.
compose() {
    HTTP_PORT="$HTTP_PORT" E2E_MAILPIT_PORT="$MAILPIT_PORT" \
        docker compose -p "$STACK_PROJECT" --project-directory "$STACK_DIR" \
        -f compose.prod.yaml -f apps/e2e/compose.mail.yaml -f apps/e2e/compose.no-proxy.yaml "$@"
}

# The version the workspace resolved, so the container's browsers are the ones
# this @playwright/test drives.
playwright_version() {
    sed -n 's/^ *"version": *"\([^"]*\)".*/\1/p' apps/e2e/node_modules/@playwright/test/package.json \
        | head -n 1
}

# A rootless daemon maps its root onto the developer, and only that user can
# write the checkout; anywhere else root would leave root-owned test results.
runner_user() {
    if docker info --format '{{.SecurityOptions}}' | grep -q rootless; then
        echo 0
    else
        echo "$(id -u):$(id -g)"
    fi
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
    # Plain localhost too: `stack.sh e2e` browses the web container on its own port 80.
    set_env SANCTUM_STATEFUL_DOMAINS "${STACK_URL#http://},localhost"
    set_env SESSION_SECURE_COOKIE false
    set_env OCTANE_HTTPS false
    set_env REGISTRATION_ENABLED true
    # A settings save would otherwise queue a call to mon-entreprise.urssaf.fr.
    set_env MON_ENTREPRISE_ENABLED false
    echo "OPUSLINE_VERSION=e2e" >> "$ENV_FILE"
    # Appended, not set: the example ships the mail block commented out, since
    # a real instance has to bring its own relay. This one is compose.mail.yaml's.
    {
        echo "MAIL_MAILER=smtp"
        echo "MAIL_HOST=mailpit"
        echo "MAIL_PORT=1025"
        echo "MAIL_FROM_ADDRESS=opusline@e2e.test"
    } >> "$ENV_FILE"
}

case "${1:-}" in
    build)
        # The Dockerfile pins its build stages with $BUILDPLATFORM, which only
        # BuildKit defines; the classic builder dies on the first FROM.
        docker buildx version > /dev/null 2>&1 \
            || { echo "stack.sh: the images need BuildKit — install the docker buildx plugin" >&2; exit 1; }
        # Behind a TLS-intercepting proxy, E2E_BUILD_CA names its CA (a PEM
        # file) for the steps that download; see the top of the Dockerfile.
        set --
        if [ -n "${E2E_BUILD_CA:-}" ]; then
            [ -f "$E2E_BUILD_CA" ] \
                || { echo "stack.sh: E2E_BUILD_CA is not a file: $E2E_BUILD_CA" >&2; exit 1; }
            set -- --secret "id=extra_ca,src=$E2E_BUILD_CA"
        fi
        docker buildx build --load --target api -t "$API_IMAGE" "$@" .
        docker buildx build --load --target web -t "$WEB_IMAGE" "$@" .
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
    e2e)
        shift
        web=$(compose ps -q web)
        [ -n "$web" ] || { echo "stack.sh: the stack is not up — run stack.sh up first" >&2; exit 1; }
        version=$(playwright_version)
        [ -n "$version" ] || { echo "stack.sh: @playwright/test is not installed — run pnpm install" >&2; exit 1; }
        # The proxy variables are cleared for the same reason as in
        # compose.no-proxy.yaml: everything this run talks to is on the stack.
        exec docker run --rm --network "container:$web" \
            --user "$(runner_user)" -e HOME=/tmp \
            -e HTTP_PROXY= -e http_proxy= -e HTTPS_PROXY= -e https_proxy= \
            -e E2E_BASE_URL=http://localhost -e E2E_MAILPIT_URL=http://mailpit:8025 \
            -v "$PWD:$PWD" -w "$PWD/apps/e2e" \
            "mcr.microsoft.com/playwright:v$version-noble" \
            node node_modules/@playwright/test/cli.js test "$@"
        ;;
    *)
        echo "usage: stack.sh build|up|down|logs|e2e [playwright args]" >&2
        exit 1
        ;;
esac
