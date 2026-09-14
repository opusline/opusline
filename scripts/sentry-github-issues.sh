#!/usr/bin/env sh
# Files a GitHub issue for every unresolved Sentry issue that has none yet.
# The repository is public and an exception message can carry user data (SQL
# bind values, client names, amounts), so the issue gets the exception type,
# where it was thrown and a link back to Sentry — never the message itself.
# What is already filed is read back from GitHub rather than inferred from a
# time window, so a skipped or failed run catches up on the next one.
set -eu

: "${SENTRY_AUTH_TOKEN:?SENTRY_AUTH_TOKEN is required}"
: "${SENTRY_ORG:?SENTRY_ORG is required}"
: "${GH_REPO:?GH_REPO is required}"
sentry_url="${SENTRY_URL:-https://sentry.io}"
dry_run="${DRY_RUN:-0}"

# Types whose message is a fixed template with no user data in it
# (monitoring.ts builds `API 503 GET /clients/{client}`), so their Sentry
# title is safe to publish as is.
safe_message_types='["ApiFailure"]'

unresolved=$(curl --silent --show-error --fail-with-body \
  --header "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  "$sentry_url/api/0/organizations/$SENTRY_ORG/issues/?project=-1&query=is:unresolved&sort=new&limit=100&collapse=stats")

if ! printf '%s' "$unresolved" | jq --exit-status 'type == "array"' >/dev/null; then
  echo "Sentry did not answer with a list of issues:" >&2
  printf '%s\n' "$unresolved" >&2
  exit 1
fi

filed_bodies=$(gh issue list --label sentry --state all --limit 1000 --json body --jq '.[].body')
filed_ids=$(printf '%s\n' "$filed_bodies" | sed -n 's/.*<!-- sentry-issue:\([0-9]*\) -->.*/\1/p')

printf '%s' "$unresolved" \
  | jq --compact-output '.[] | select(.metadata.type != "SentryTestError")' \
  | while IFS= read -r issue; do
    id=$(printf '%s' "$issue" | jq --raw-output '.id')
    if printf '%s\n' "$filed_ids" | grep --quiet --line-regexp "$id"; then
      continue
    fi

    title=$(printf '%s' "$issue" | jq --raw-output --argjson safe "$safe_message_types" '
      .metadata.type as $type
      | "[\(.shortId)] " + (
          if ($type | IN($safe[])) then .title
          elif (.culprit // "") == "" then ($type // "Message")
          else "\($type // "Message") in \(.culprit)"
          end
        )')

    body=$(printf '%s' "$issue" | jq --raw-output '[
      "Filed automatically from Sentry. The message and stack trace stay in Sentry.",
      "",
      "| | |",
      "|---|---|",
      "| Project | `\(.project.slug)` |",
      "| Level | \(.level) |",
      "| Events | \(.count) |",
      "| Users | \(.userCount) |",
      "| First seen | \(.firstSeen) |",
      "| Last seen | \(.lastSeen) |",
      "",
      "[\(.shortId) in Sentry](\(.permalink))",
      "",
      "<!-- sentry-issue:\(.id) -->"
    ] | join("\n")')

    if [ "$dry_run" = 1 ]; then
      printf '=== %s\n%s\n\n' "$title" "$body"
      continue
    fi

    printf '%s\n' "$body" | gh issue create --label sentry --label bug --title "$title" --body-file -
  done
