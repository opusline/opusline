#!/usr/bin/env sh
# Files a GitHub issue for every unresolved Sentry issue that has none yet, and
# keeps the two sides in step: an issue Sentry no longer lists as unresolved is
# closed, a regression reopens it.
#
# The repository is public and an exception message can carry user data (SQL
# bind values, client names, amounts), so an issue gets the exception type,
# where it was thrown, the release it came from and a link back to Sentry —
# never the message, the frame variables or the request. Stack frames are
# published for this repository's own code only, which is public anyway.
#
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
# title is safe to publish — once it is proven to have that shape. A browser
# DSN is public by design, so anyone can send an event of any type with any
# title; the type alone proves nothing.
safe_message_types='["ApiFailure"]'
safe_title_pattern='^API [0-9]{3} (GET|POST|PUT|PATCH|DELETE) /[A-Za-z0-9_./{}-]*$'

# Every other string below comes from the event, which the same public DSN
# lets anyone write. Stripped of what could close the table row, the code span
# or the HTML comment the filed marker lives in — a transaction named
# `<!-- sentry-issue:1 -->` would otherwise be read back as this issue's id.
clean_filter='def clean: tostring | gsub("[`<>|\\r\\n]"; "");'

headers_file=$(mktemp)
trap 'rm -f "$headers_file"' EXIT

sentry_get() {
  curl --silent --show-error --fail-with-body \
    --header "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
    --dump-header "$headers_file" \
    "$sentry_url$1"
}

issues_path="/api/0/organizations/$SENTRY_ORG/issues/?project=-1&query=is:unresolved&sort=new&limit=100"
unresolved='[]'
cursor=''
while :; do
  page=$(sentry_get "$issues_path${cursor:+&cursor=$cursor}")

  if ! printf '%s' "$page" | jq --exit-status 'type == "array"' >/dev/null; then
    echo "Sentry did not answer with a list of issues:" >&2
    printf '%s\n' "$page" >&2
    exit 1
  fi
  unresolved=$(printf '%s\n%s' "$unresolved" "$page" | jq --slurp --compact-output 'add')

  cursor=$(sed -n 's/.*rel="next"; results="true"; cursor="\([^"]*\)".*/\1/p' "$headers_file")
  [ -n "$cursor" ] || break
done

unresolved_ids=$(printf '%s' "$unresolved" | jq --raw-output '.[].id')
regressed_ids=$(printf '%s' "$unresolved" | jq --raw-output '.[] | select(.substatus == "regressed") | .id')

holds_id() {
  printf '%s\n' "$1" | grep --quiet --line-regexp "$2"
}

# Every marker, paged rather than capped: a triaged-and-closed issue keeps its
# marker forever, so any fixed ceiling is one the repository grows through, and
# the first issue to fall off the end is filed a second time. `--paginate`
# follows the Link headers to the end. Pull requests can carry the label too and
# are not issues we ever filed, so they are dropped.
filed=$(gh api --paginate "repos/$GH_REPO/issues?labels=sentry&state=all&per_page=100" \
  --jq '.[] | select(has("pull_request") | not) | {number, state: (.state | ascii_upcase), body}' \
  | jq --raw-output '
  ((.body // "") | capture("<!-- sentry-issue:(?<id>[0-9]+) -->\\s*$")) as $marker
  | "\($marker.id) \(.number) \(.state)"')
filed_ids=$(printf '%s' "$filed" | cut --delimiter=' ' --fields=1)

printf '%s' "$unresolved" \
  | jq --compact-output '.[] | select(.metadata.type != "SentryTestError")' \
  | while IFS= read -r issue; do
    id=$(printf '%s' "$issue" | jq --raw-output '.id')
    if holds_id "$filed_ids" "$id"; then
      continue
    fi

    # The list carries no stack, so the newest event is what says which of our
    # files threw. A stale issue whose events have aged out still gets filed.
    if ! event=$(sentry_get "/api/0/organizations/$SENTRY_ORG/issues/$id/events/latest/"); then
      echo "No event for Sentry issue $id, filing without its details." >&2
      event='null'
    fi

    title=$(printf '%s' "$issue" | jq --raw-output --argjson safe "$safe_message_types" --arg safe_title "$safe_title_pattern" --argjson event "$event" "$clean_filter"'
      def frames: [$event.entries[]? | select(.type == "exception") | .data.values[]?
        | .stacktrace.frames[]? | select(.inApp)];

      (.metadata.type // "Message" | clean) as $type
      | (first(frames | reverse | .[] | "\(.filename | clean):\(.lineNo | clean)") // (.culprit // "" | clean)) as $location
      | "[\(.shortId | clean)] " + (
          if ($type | IN($safe[])) and ((.title // "") | test($safe_title)) then .title
          elif $location == "" then $type
          else "\($type) at \($location)"
          end
        )')

    body=$(printf '%s' "$issue" | jq --raw-output --argjson event "$event" "$clean_filter"'
      def tag($key): first($event.tags[]? | select(.key == $key) | .value) // "unknown" | clean;
      def frames: [$event.entries[]? | select(.type == "exception") | .data.values[]?
        | .stacktrace.frames[]? | select(.inApp)
        | "\(.filename | clean):\(.lineNo | clean) in \(.function // "?" | clean)"];

      (frames | reverse | .[0:8]) as $own_frames
      | [
        "Filed automatically from Sentry. The message, the frame variables and the request stay in Sentry.",
        "",
        "| | |",
        "|---|---|",
        "| Project | `\(.project.slug | clean)` |",
        "| Level | \(.level | clean) |",
        "| Culprit | `\(.culprit // "unknown" | clean)` |",
        "| Transaction | `\(tag("transaction"))` |",
        "| Release | `\(tag("release"))` |",
        "| Environment | `\(tag("environment"))` |",
        "| Handled | \(tag("handled")) |",
        "| Events | \(.count) |",
        "| Users | \(.userCount) |",
        "| First seen | \(.firstSeen) |",
        "| Last seen | \(.lastSeen) |"
      ]
      + (if ($own_frames | length) == 0 then ["", "No frame of this repository is in the stack."]
         else ["", "Our frames, innermost first:", "", "```"] + $own_frames + ["```"] end)
      + [
        "",
        "[\(.shortId | clean) in Sentry](\(.permalink | clean))",
        "",
        "<!-- sentry-issue:\(.id) -->"
      ]
      | join("\n")')

    if [ "$dry_run" = 1 ]; then
      printf '=== %s\n%s\n\n' "$title" "$body"
      continue
    fi

    printf '%s\n' "$body" | gh issue create --label sentry --label bug --title "$title" --body-file -
  done

# Sentry is the source of truth for whether something is still happening: an
# issue resolved or archived there no longer appears in the list above, and a
# regression puts it back. Closing on GitHub is what resolves it in Sentry
# (sentry-issue-status.yml), so a close never fights this.
printf '%s\n' "$filed" | while read -r sentry_id number state; do
  [ -n "${sentry_id:-}" ] || continue

  if [ "$state" = OPEN ] && ! holds_id "$unresolved_ids" "$sentry_id"; then
    if [ "$dry_run" = 1 ]; then
      echo "=== would close #$number (Sentry $sentry_id is no longer unresolved)"
    else
      gh issue close "$number" --comment "Closed automatically: Sentry no longer lists this as unresolved."
    fi
  elif [ "$state" = CLOSED ] && holds_id "$regressed_ids" "$sentry_id"; then
    if [ "$dry_run" = 1 ]; then
      echo "=== would reopen #$number (Sentry $sentry_id regressed)"
    else
      gh issue reopen "$number" --comment "Reopened automatically: Sentry marked this a regression."
    fi
  fi
done
