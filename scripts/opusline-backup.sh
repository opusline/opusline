#!/usr/bin/env sh
# Back up, restore and inspect a self-hosted Opusline.
#
# Deliberately a shell script and deliberately outside the app: it has to work
# when the app does not. It never talks to Laravel — the database is dumped
# through its own container, so a broken migration, a crash-looping API or an
# image that will not boot changes nothing here.
#
#   ./opusline-backup.sh backup            one archive of everything that holds state
#   ./opusline-backup.sh verify FILE       what is in an archive, without unpacking it
#   ./opusline-backup.sh restore FILE      put it back into a stack that is up
#
# Run it from the directory holding compose.prod.yaml and .env, or point it
# elsewhere with OPUSLINE_DIR. Needs docker and the database container running;
# nothing else.
set -eu

COMPOSE_FILE="${OPUSLINE_COMPOSE:-compose.prod.yaml}"
ENV_FILE="${OPUSLINE_ENV:-.env}"
BACKUP_DIR="${OPUSLINE_BACKUP_DIR:-./backups}"
# 0 keeps everything. Anything else keeps that many of the newest and deletes
# the rest — after the new one is written, so a failed backup never prunes.
KEEP="${OPUSLINE_KEEP:-0}"

if [ -n "${OPUSLINE_DIR:-}" ]; then
  cd "$OPUSLINE_DIR"
fi

fail() {
  echo "opusline-backup: $1" >&2
  exit 1
}

compose() {
  docker compose -f "$COMPOSE_FILE" "$@"
}

# The env file is the source of truth for the database, exactly as it is for the
# stack. Read rather than sourced: a value with a space in it must not become
# two words, and nothing in here should be able to run a command.
env_value() {
  sed -n "s/^$1=//p" "$ENV_FILE" | tail -n 1 | sed 's/^"//; s/"$//'
}

require_stack() {
  [ -f "$COMPOSE_FILE" ] || fail "no $COMPOSE_FILE here. Run from the stack's directory, or set OPUSLINE_DIR."
  [ -f "$ENV_FILE" ] || fail "no $ENV_FILE here — and it holds APP_KEY, without which a restored database is unreadable."
  command -v docker > /dev/null 2>&1 || fail "docker is not on PATH."
}

# Which database, and therefore which dump tool. Defaulted the way the compose
# file defaults them, so an env that leaves them out still works.
db_connection() { echo "${OPUSLINE_DB_CONNECTION:-$(env_value DB_CONNECTION)}"; }
db_name() { echo "$(env_value DB_DATABASE)" | grep . || echo opusline; }
db_user() { echo "$(env_value DB_USERNAME)" | grep . || echo opusline; }

dump_database() {
  destination="$1"

  case "$(db_connection)" in
    pgsql | postgres | postgresql | "")
      compose exec -T postgres pg_dump --clean --if-exists -U "$(db_user)" "$(db_name)" > "$destination"
      ;;
    mysql | mariadb)
      compose exec -T mysql mysqldump \
        --user="$(db_user)" --password="$(env_value DB_PASSWORD)" \
        --single-transaction --routines "$(db_name)" > "$destination"
      ;;
    sqlite)
      fail "a SQLite instance is a file in the storage volume; back that volume up and you have the database too."
      ;;
    *)
      fail "unknown DB_CONNECTION '$(db_connection)'."
      ;;
  esac
}

load_database() {
  source_file="$1"

  case "$(db_connection)" in
    pgsql | postgres | postgresql | "")
      compose exec -T postgres psql -U "$(db_user)" -d "$(db_name)" < "$source_file"
      ;;
    mysql | mariadb)
      compose exec -T mysql mysql \
        --user="$(db_user)" --password="$(env_value DB_PASSWORD)" "$(db_name)" < "$source_file"
      ;;
    *)
      fail "unknown DB_CONNECTION '$(db_connection)'."
      ;;
  esac
}

# Compose prefixes a volume with the project name, and the project name is not
# always "opusline" — a second instance, a renamed directory, `-p` on the command
# line. Asked of docker by the labels compose puts on the volume rather than
# guessed, because `docker run -v` on a name that does not exist creates an empty
# volume and would back up nothing at all, quietly.
project_name() {
  container="$(compose ps --quiet | head -n 1)"

  [ -n "$container" ] || fail "no container of this stack is running — start it, or the database cannot be dumped."

  docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }}' "$container"
}

storage_volume() {
  project="$(project_name)"
  volume="$(docker volume ls --quiet \
    --filter "label=com.docker.compose.project=$project" \
    --filter "label=com.docker.compose.volume=opusline-storage" | head -n 1)"

  # A volume compose adopted rather than created carries no labels — it happens
  # to anyone who ran a `docker run -v` before the stack ever came up. Falling
  # back to the name compose would have used is safe because the line below
  # refuses anything docker does not already know about.
  [ -n "$volume" ] || volume="${project}_opusline-storage"

  docker volume inspect "$volume" > /dev/null 2>&1 \
    || fail "could not find this stack's uploads volume (looked for $volume). Has it ever started?"

  echo "$volume"
}

# The volume is resolved by the caller and passed in: a `fail` inside a command
# substitution kills only the subshell, so `-v "$(storage_volume)":/data` would
# carry on with an empty name — and `docker run -v` on a name that does not exist
# creates an empty volume, which is how a backup ends up holding nothing.
archive_storage() {
  docker run --rm \
    -v "$1":/data:ro \
    -v "$2":/out \
    alpine tar czf /out/storage.tar.gz -C /data .
}

extract_storage() {
  docker run --rm \
    -v "$1":/data \
    -v "$2":/in:ro \
    alpine sh -c 'rm -rf /data/* && tar xzf /in/storage.tar.gz -C /data'
}

# Opusline cannot see the backup directory: it is on the host, and
# OPUSLINE_BACKUP_DIR can point anywhere. So the one thing that knows a backup
# succeeded leaves a note in the uploads volume, which the app does mount, and
# the account menu reads it back. Nothing depends on it — delete the file and
# the app simply says it has no record.
record_backup() {
  volume="$1"
  taken_at="$2"
  # A quote or a backslash in the path would produce invalid JSON, which the app
  # reads as "no record" rather than crashing; escaping keeps it honest anyway.
  archive_path="$(printf '%s' "$3" | sed 's/\\/\\\\/g; s/"/\\"/g')"
  bytes="$4"

  printf '{"version":1,"taken_at":"%s","archive":"%s","bytes":%s}\n' \
    "$taken_at" "$archive_path" "$bytes" \
    | docker run --rm -i -v "$volume":/data alpine \
      sh -c 'cat > /data/opusline-backup.json'
}

manifest_value() {
  sed -n "s/^$2=//p" "$1" | tail -n 1
}

prune() {
  [ "$KEEP" -gt 0 ] 2> /dev/null || return 0

  # shellcheck disable=SC2012 # names are ours, generated from a timestamp
  ls -1t "$BACKUP_DIR"/opusline-*.tar.gz 2> /dev/null \
    | tail -n "+$((KEEP + 1))" \
    | while read -r old; do
        echo "  pruned $(basename "$old")"
        rm -f "$old"
      done
}

backup() {
  require_stack

  stamp="$(date +%Y%m%d-%H%M%S)"
  taken_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  archive="$BACKUP_DIR/opusline-$stamp.tar.gz"
  work="$(mktemp -d)"
  # shellcheck disable=SC2064 # expand now: $work must not change under the trap
  trap "rm -rf '$work'" EXIT

  mkdir -p "$BACKUP_DIR"

  # Resolved before anything is written: a stack whose volume cannot be found has
  # to fail here rather than produce an archive with an empty uploads tarball.
  volume="$(storage_volume)"

  echo "Dumping the database…"
  dump_database "$work/database.sql"

  echo "Archiving the uploads from $volume…"
  archive_storage "$volume" "$work"

  # The env file carries APP_KEY. Without it the database restores fine and
  # nobody can log in, which is the failure mode that looks like a good backup.
  cp "$ENV_FILE" "$work/env"

  cat > "$work/MANIFEST" <<MANIFEST
opusline-backup 1
taken_at=$taken_at
db_connection=$(db_connection)
db_database=$(db_name)
storage_volume=$volume
MANIFEST

  tar czf "$archive" -C "$work" MANIFEST database.sql storage.tar.gz env

  echo "Wrote $archive ($(du -h "$archive" | cut -f1))"
  record_backup "$volume" "$taken_at" "$archive" "$(wc -c < "$archive" | tr -d ' ')"
  prune
}

verify() {
  archive="${1:-}"
  [ -n "$archive" ] || fail "verify needs an archive: opusline-backup.sh verify FILE"
  [ -f "$archive" ] || fail "no such archive: $archive"

  tar tzf "$archive" > /dev/null || fail "$archive is not readable as a tar.gz."

  for part in MANIFEST database.sql storage.tar.gz env; do
    tar tzf "$archive" | grep -qx "$part" || fail "$archive is missing $part."
  done

  echo "$archive holds all four parts:"
  tar xzf "$archive" -O MANIFEST | sed 's/^/  /'
  echo "  database.sql  $(tar tzvf "$archive" | awk '$NF == "database.sql" { print $3 }') bytes"
  echo "  storage.tar.gz  $(tar tzvf "$archive" | awk '$NF == "storage.tar.gz" { print $3 }') bytes"
}

restore() {
  archive="${1:-}"
  verify "$archive"
  require_stack

  printf 'This replaces the database and the uploads of the stack in %s. Type RESTORE to go on: ' "$(pwd)"
  read -r confirmation
  [ "$confirmation" = "RESTORE" ] || fail "not confirmed; nothing was touched."

  volume="$(storage_volume)"
  work="$(mktemp -d)"
  # shellcheck disable=SC2064
  trap "rm -rf '$work'" EXIT
  tar xzf "$archive" -C "$work"

  echo "Loading the database…"
  load_database "$work/database.sql"

  echo "Restoring the uploads into $volume…"
  extract_storage "$volume" "$work"

  # The archive carries the note of the backup *before* it, so the app would
  # name the wrong one until the next backup. This archive is the truth now.
  record_backup "$volume" "$(manifest_value "$work/MANIFEST" taken_at)" \
    "$archive" "$(wc -c < "$archive" | tr -d ' ')"

  echo
  echo "Done. The archive's env file is at $work/env — it is NOT copied over"
  echo "yours, because it carries the APP_KEY and the passwords of the instance"
  echo "it came from. If this is a new machine, take APP_KEY from it, or every"
  echo "session and encrypted column in the restored database stays unreadable."
  # The trap would delete it out from under that instruction.
  trap - EXIT
  echo "(That directory is yours to delete once you have what you need.)"
}

case "${1:-}" in
  backup) backup ;;
  verify) shift; verify "${1:-}" ;;
  restore) shift; restore "${1:-}" ;;
  *)
    echo "Usage: opusline-backup.sh backup | verify FILE | restore FILE" >&2
    exit 64
    ;;
esac
