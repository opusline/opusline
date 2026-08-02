#!/usr/bin/env sh
set -e

cd "$(dirname "$0")/.."

COMPOSER_IMAGE="laravelsail/php84-composer:latest"

run_in_composer_container() {
    docker run --rm \
        -u "$(id -u):$(id -g)" \
        -v "$PWD:/var/www/html" \
        -w /var/www/html \
        "$COMPOSER_IMAGE" \
        "$@"
}

if [ ! -d vendor ]; then
    run_in_composer_container composer install --ignore-platform-reqs
fi

if [ ! -f .env ]; then
    cp .env.example .env
    run_in_composer_container php artisan key:generate
fi
