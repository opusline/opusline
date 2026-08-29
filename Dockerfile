# syntax=docker/dockerfile:1
#
# Two images from one file, built with `--target api` and `--target web`.
#
# They are separate because the app is: `web` is a static SPA with no server
# runtime of its own, and `api` is Laravel on FrankenPHP. Serving both from one
# origin is not optional — session auth rides an XSRF cookie, so `web` proxies
# /api and /sanctum to `api` rather than pointing at a second hostname. See
# docs/self-hosting.md.
#
# Nothing here bind-mounts the source or ships `vendor/`: the dev stack in
# apps/api/compose.yaml is a Sail image built from the host's own vendor
# directory, which is why it could never be a deployment.

# ---------------------------------------------------------------- SPA build --
# $BUILDPLATFORM, not the target: the SPA is static JS and CSS, so building it
# once natively beats building it again under arm64 emulation.
FROM --platform=$BUILDPLATFORM node:26-alpine AS web-build

# Node 26 ships no corepack, so pnpm is installed outright — pinned to the same
# version package.json's `packageManager` field names.
RUN npm install --global pnpm@10.33.4

WORKDIR /src

# The manifests alone first, so a source-only change reuses the install layer.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/storybook/package.json apps/storybook/
COPY apps/web/package.json apps/web/
COPY packages/api-client/package.json packages/api-client/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile --ignore-scripts

# Only what Vite reads, so an API- or docs-only commit is a cache hit here.
COPY apps/web apps/web
COPY packages/ui packages/ui
COPY packages/api-client packages/api-client

# `vite build` directly rather than through turbo: the build graph reaches the
# API's generate task, and that needs PHP. The generated client, route tree and
# message catalogs are committed and drift-checked, so there is nothing to
# regenerate here.
RUN pnpm --filter @opusline/web build

# --------------------------------------------------------- PHP dependencies --
# Also native: this stage resolves pure-PHP packages and writes a classmap.
FROM --platform=$BUILDPLATFORM composer:2 AS vendor

WORKDIR /src

COPY apps/api/composer.json apps/api/composer.lock ./
# Platform requirements are ignored here and satisfied in the runtime stage
# below: this image resolves packages, it never runs them, and its PHP carries
# neither the extensions nor the version the app asks for.
RUN composer install \
      --no-dev --no-scripts --no-autoloader \
      --prefer-dist --no-interaction --no-progress \
      --ignore-platform-reqs

COPY apps/api ./
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev --ignore-platform-reqs

# ----------------------------------------------------------------- API image --
FROM dunglas/frankenphp:1-php8.5-alpine AS api

# gd/exif back the media library, the two pdo drivers back the supported
# databases, redis backs the recommended session/cache/queue stores, and pcntl
# is what lets Octane manage its workers.
RUN install-php-extensions \
      bcmath \
      exif \
      gd \
      intl \
      opcache \
      pcntl \
      pdo_mysql \
      pdo_pgsql \
      redis \
      zip

WORKDIR /app

COPY --from=vendor /src /app

# Octane's worker script is gitignored, so a CI checkout builds an image
# without it — and at boot Octane would then try to copy it into the
# root-owned public/ as the app user and die. Install it from the very vendor
# tree the image ships, so the file always matches the Octane version.
RUN cp vendor/laravel/octane/src/Commands/stubs/frankenphp-worker.php public/frankenphp-worker.php

# Laravel's writable tree is gitignored, so it does not exist in the build
# context and has to be created here. Octane writes nowhere else at runtime.
RUN mkdir -p \
      storage/app/private storage/app/public \
      storage/framework/cache/data storage/framework/sessions storage/framework/views \
      storage/logs bootstrap/cache \
    && addgroup -S opusline && adduser -S -G opusline opusline \
    && chown -R opusline:opusline storage bootstrap/cache

COPY docker/api-entrypoint.sh /usr/local/bin/opusline-entrypoint
RUN chmod +x /usr/local/bin/opusline-entrypoint

# OPcache sized for the ~12,600-file app+vendor tree; kept out of
# apps/api/php.ini so the dev binary keeps validating timestamps.
COPY docker/api-php.ini /usr/local/etc/php/conf.d/opusline-opcache.ini

ENV APP_ENV=production \
    APP_DEBUG=false \
    OCTANE_SERVER=frankenphp \
    SERVER_NAME=:8000

EXPOSE 8000

USER opusline

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s \
  CMD wget --spider -q http://127.0.0.1:8000/up || exit 1

ENTRYPOINT ["opusline-entrypoint"]
CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]

# ----------------------------------------------------------------- Web image --
FROM caddy:2-alpine AS web

COPY --from=web-build /src/apps/web/dist /srv
COPY docker/web.Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --spider -q http://127.0.0.1/ || exit 1
