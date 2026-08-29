# Self-hosting Opusline

Opusline is meant to run on your own machine, with your own data. This is the
supported way to do that.

Two images are published to GHCR on every release:

| Image | What it is |
| --- | --- |
| `ghcr.io/opusline/opusline-web` | Caddy serving the built SPA, and proxying `/api` + `/sanctum` |
| `ghcr.io/opusline/opusline-api` | Laravel on FrankenPHP (Octane) |

They are separate because the app is: the web app compiles to static files and
has no server runtime of its own.

> The stack in `apps/api/compose.yaml` is **not** this. That one is the
> development Sail environment — it builds from your host's `vendor/`,
> bind-mounts the whole repository and carries hardcoded credentials. Use it to
> work on Opusline, never to run it.

## First boot

```sh
curl -fsSLO https://github.com/opusline/opusline/releases/latest/download/compose.prod.yaml
curl -fsSL -o .env https://github.com/opusline/opusline/releases/latest/download/example.env

# The one secret you must not lose: it decrypts every session, cookie and
# calendar token the instance ever issues.
docker run --rm ghcr.io/opusline/opusline-api:latest php artisan key:generate --show
```

Both files come from the release, not from `main`, so they always match the
images `latest` points at. To pin a version instead, take the same two files
from that release's page — its `example.env` names its own tag — and use that
tag in the command above.

Put that key in `APP_KEY`, set `DB_PASSWORD` to something of your own, and point
`APP_URL`, `SESSION_DOMAIN` and `SANCTUM_STATEFUL_DOMAINS` at the hostname you
will actually use. Then:

```sh
docker compose -f compose.prod.yaml up -d
```

The API container runs the migrations on start, so there is no separate install
step. Open the app, register the first account, and you are done — Opusline is
single-tenant, so registration is for you.

## The compose file

`compose.prod.yaml` in full, if you would rather paste it than download it — into
a file, or into whatever box your host gives you (Portainer, Synology's Container
Manager, QNAP's Container Station, Unraid's Compose Manager all take it as-is).
Keep it and `.env` in the same directory: compose reads `.env` from beside itself.
The exact copy for your version is attached to
[its release](https://github.com/opusline/opusline/releases).

<!-- compose-prod-begin — generated from compose.prod.yaml by scripts/compose-doc-guard.sh; edit the file, not this block -->
```yaml
# A self-hosted Opusline: the SPA, the API, Postgres and Redis.
#
# Copy .env.production.example to .env, fill it in, then:
#
#   docker compose -f compose.prod.yaml up -d
#
# This is not apps/api/compose.yaml. That one is the development Sail stack — it
# builds from the host's vendor directory, bind-mounts the whole tree and ships
# hardcoded credentials. It was never a deployment and this is why.

name: opusline

# The API image, run three ways: the HTTP server, the scheduler, and the queue
# worker. Only the first serves requests, so only the first keeps the image's
# healthcheck.
x-api: &api
  image: ghcr.io/opusline/opusline-api:${OPUSLINE_VERSION:-latest}
  restart: unless-stopped
  env_file: .env
  volumes:
    # Uploaded documents, signatures and client logos, when MEDIA_DISK=local.
    - opusline-storage:/app/storage/app

x-api-worker: &api-worker
  <<: *api
  depends_on:
    api:
      condition: service_healthy
  # The API container migrates on boot; a second one racing it would be the only
  # way this stack could corrupt a schema.
  environment:
    OPUSLINE_SKIP_MIGRATIONS: "1"
  # The image's healthcheck probes HTTP, which a worker does not serve. It is
  # replaced rather than disabled — `up --wait` refuses a container left with
  # no check at all — by process liveness: artisan is PID 1 via exec, so a
  # dead worker is a dead container, and this check simply says so.
  healthcheck:
    test: ["CMD-SHELL", "pgrep -f artisan || exit 1"]
    interval: 30s
    timeout: 5s
    retries: 3

services:
  web:
    image: ghcr.io/opusline/opusline-web:${OPUSLINE_VERSION:-latest}
    restart: unless-stopped
    depends_on:
      api:
        condition: service_healthy
    ports:
      # Plain HTTP on purpose: terminate TLS in the proxy that already holds your
      # certificate and forward here. See docs/self-hosting.md.
      - "${HTTP_PORT:-8080}:80"

  api:
    <<: *api
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # The nightly URSSAF barème refresh.
  scheduler:
    <<: *api-worker
    command: ["php", "artisan", "schedule:work"]

  # Every uploaded document, logo and signature is moved to its final disk by a
  # queued job. Without this the jobs accumulate and the files stay on the
  # staging disk forever.
  queue:
    <<: *api-worker
    command: ["php", "artisan", "queue:work", "--tries=3", "--max-time=3600"]

  postgres:
    image: postgres:18-alpine
    restart: unless-stopped
    # Surface slow queries in `docker compose logs postgres` — unbounded-growth
    # regressions should show up in the field, not stay invisible.
    command: ["postgres", "-c", "log_min_duration_statement=${PG_SLOW_QUERY:-200ms}"]
    environment:
      POSTGRES_DB: ${DB_DATABASE:-opusline}
      POSTGRES_USER: ${DB_USERNAME:-opusline}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?set DB_PASSWORD in .env}
    volumes:
      # /var/lib/postgresql, not .../data: Postgres 18 keeps its cluster in a
      # versioned subdirectory so `pg_upgrade --link` can work across a mount
      # point, and refuses to start on a volume mounted the old way.
      - opusline-postgres:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME:-opusline} -d ${DB_DATABASE:-opusline}"]
      interval: 10s
      timeout: 5s
      retries: 10

  redis:
    image: redis:8-alpine
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - opusline-redis:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 10

volumes:
  opusline-postgres:
  opusline-redis:
  opusline-storage:
```
<!-- compose-prod-end -->

Six services: `web` serves the SPA and proxies `/api`, `api` is Laravel,
`scheduler` runs the nightly barème refresh, `queue` moves uploaded files to
their final disk, and `postgres` + `redis` hold the state. The three that share
the API image differ only in their command, which is what the YAML anchors say.

Nothing here is host-specific, and the images are published for arm64 as well as
amd64, so a Raspberry Pi or an ARM NAS needs no build. Two things you may want to
change:

- **The port.** `HTTP_PORT` defaults to 8080, which collides with a lot of
  pre-installed software. Anything free works — the reverse proxy below is what
  the browser actually talks to.
- **Where uploads live.** They sit in the `opusline-storage` volume. To keep them
  somewhere you can see, swap that one line on the `x-api` anchor for a bind
  mount — `- /srv/opusline/storage:/app/storage/app`. Leave Postgres on its named
  volume; a database does not belong on a network share.

## Putting it behind TLS

`web` publishes plain HTTP on `HTTP_PORT` (8080 by default) and terminates
nothing. Point whatever already holds your certificate at it.

The SPA calls `/api` and `/sanctum` on its own origin with no configurable base
URL — that is deliberate, because session auth rides an XSRF cookie and a second
hostname would break it. So the proxy has one job: forward everything for one
hostname to `web`, unchanged.

Caddy:

```caddyfile
opusline.example.com {
	reverse_proxy localhost:8080
}
```

nginx:

```nginx
server {
	listen 443 ssl http2;
	server_name opusline.example.com;

	# ssl_certificate / ssl_certificate_key ...

	location / {
		proxy_pass http://127.0.0.1:8080;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		# Without this the app builds http:// URLs and issues the session cookie
		# without its Secure attribute, which reads as "logs me out at random".
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

`X-Forwarded-Proto` is the one that matters, together with `OCTANE_HTTPS=true`
and `SESSION_SECURE_COOKIE=true` in `.env`. Those three are what make the
cookie flow work behind TLS termination; missing any of them shows up as
intermittent 419s on writes rather than as an obvious error.

`TRUSTED_PROXIES=*` in the example env is safe **because** the API container is
reachable only through `web` on the compose network. If you expose the API
container directly, narrow it to the proxy's address — an app that believes
`X-Forwarded-For` from anyone has no working rate limit.

## Backups

Three things hold state. All three have to be in the same backup, taken at the
same time:

1. **The database** — every client, mission, entry, invoice and bank movement.
2. **The `opusline-storage` volume** — uploaded documents, client logos and
   signatures, when `MEDIA_DISK=local`.
3. **`APP_KEY`, in your `.env`** — without it the database restores fine and
   nobody can log in.

```sh
# Database
docker compose -f compose.prod.yaml exec -T postgres \
  pg_dump -U opusline opusline | gzip > opusline-$(date +%F).sql.gz

# Uploads
docker run --rm -v opusline_opusline-storage:/data -v "$PWD":/backup alpine \
  tar czf /backup/opusline-storage-$(date +%F).tar.gz -C /data .
```

Restore is the same in reverse, into a stack that is up but has never been
opened in a browser. Check a restore before you need one: an untested backup is
a hope.

## Upgrading

```sh
docker compose -f compose.prod.yaml pull
docker compose -f compose.prod.yaml up -d
```

Migrations run on start, so that is the whole upgrade. Take the database backup
first anyway — a migration is the one thing a rollback cannot undo.

Images are built only when a release is cut, so every tag corresponds to one:
`latest`, the exact version (`0.20.0`) and the minor series (`0.20`). Nothing is
published from `main`. By default the stack follows `latest`; to decide upgrades
yourself, pin `OPUSLINE_VERSION` in `.env` and raise it when you mean to.

## Taking it down

```sh
docker compose -f compose.prod.yaml down
```

stops and removes the containers. The data stays in the volumes; the next
`up -d` continues where it left off.

```sh
docker compose -f compose.prod.yaml down --volumes
```

is the uninstall: it destroys the database, the uploads and the Redis state.
`APP_KEY` is in neither — it lives in `.env`, beside the compose file — so
deleting that directory deletes the one thing no backup can be restored
without.

## Choices you can change

**Database.** Postgres in `compose.prod.yaml`; MySQL 8.4 also works — swap the
service and set `DB_CONNECTION=mysql`, `DB_PORT=3306`. SQLite passes the same
test matrix but is not a supported shape for this stack: three containers would
be sharing one database file over a volume, and the backup story above is
`pg_dump`, not a file copy. Run it only if you are prepared to own that
topology yourself.

**Uploads.** `MEDIA_DISK=local` keeps files in the volume. For object storage,
set `MEDIA_DISK=s3` and the `AWS_*` block — any S3-compatible endpoint works,
including MinIO and Garage.

**Redis.** Backs sessions, cache and the queue. You can drop the service and set
`SESSION_DRIVER=database`, `CACHE_STORE=database`, `QUEUE_CONNECTION=database`;
the tables ship in the migrations. One less container, a slower app. The `queue`
worker stays either way — it is what moves an uploaded document to its final
disk, so without it uploads sit on the staging disk forever.

**Fiscal rates.** `MON_ENTREPRISE_ENABLED=false` stops the daily call to
`mon-entreprise.urssaf.fr`, for an air-gapped install. Contribution rates then
stay whatever you set in Réglages.

## When something is wrong

```sh
docker compose -f compose.prod.yaml logs -f api
docker compose -f compose.prod.yaml exec api php artisan about
docker compose -f compose.prod.yaml exec api php artisan queue:failed
```

Six services run: `web` (the SPA and the proxy), `api`, `queue` and `scheduler`
(the same image, different commands), `postgres` and `redis`.

| Symptom | Cause |
| --- | --- |
| Uploaded documents never appear | The `queue` service is down; `queue:failed` shows what it choked on |
| 419 on every save | `SESSION_DOMAIN` / `SANCTUM_STATEFUL_DOMAINS` do not match the host in the browser's address bar |
| Logged out at random | `SESSION_SECURE_COOKIE=true` without the proxy sending `X-Forwarded-Proto` |
| Links point at `http://` | `OCTANE_HTTPS` is not `true` |
| `The MAC is invalid` | `APP_KEY` changed. Put the old one in `APP_PREVIOUS_KEYS` |
| Login throttled instantly for everyone | `TRUSTED_PROXIES` unset, so every request looks like it comes from the proxy |
| `no such table: sessions` | An older image. Upgrade — the migration ships now |
| Forgot the password | There is no reset email. Set a new one from the shell, below |

Opusline never sends email — there is no reset route and nothing configured to
send one — so a forgotten password is fixed where you already have root:

```sh
docker compose -f compose.prod.yaml exec api php artisan tinker \
  --execute 'App\Domain\Users\Models\User::first()->update(["password" => "a-new-password"]);'
```

The model hashes the password on assignment, and the instance is single-tenant,
so the first user is you.

Found something this page does not cover? Open an issue with the "Self-hosting /
Docker" area — that template exists for exactly this.
