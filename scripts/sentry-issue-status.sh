#!/usr/bin/env sh
# Mirrors the state of a GitHub issue filed from Sentry back onto its Sentry
# issue: closing resolves it, closing as not planned archives it, reopening
# un-resolves it. Without this the poller would see the issue still unresolved
# in Sentry and the two sides would disagree forever.
set -eu

: "${SENTRY_AUTH_TOKEN:?SENTRY_AUTH_TOKEN is required}"
: "${SENTRY_ORG:?SENTRY_ORG is required}"
: "${ISSUE_STATE:?ISSUE_STATE is required}"
sentry_url="${SENTRY_URL:-https://sentry.io}"
dry_run="${DRY_RUN:-0}"

sentry_id=$(printf '%s' "${ISSUE_BODY:-}" | sed -n 's/.*<!-- sentry-issue:\([0-9]*\) -->.*/\1/p')
if [ -z "$sentry_id" ]; then
  echo "This issue carries no Sentry marker, nothing to mirror."
  exit 0
fi

case "$ISSUE_STATE" in
  closed)
    # `not planned` is the one close that means "stop telling me", so it
    # archives rather than resolves: a recurrence will not reopen the issue.
    if [ "${ISSUE_STATE_REASON:-}" = not_planned ]; then
      status=ignored
    else
      status=resolved
    fi
    ;;
  open) status=unresolved ;;
  *)
    echo "Unknown issue state: $ISSUE_STATE" >&2
    exit 1
    ;;
esac

if [ "$dry_run" = 1 ]; then
  echo "=== would set Sentry issue $sentry_id to $status"
  exit 0
fi

jq --null-input --arg status "$status" '{status: $status}' \
  | curl --silent --show-error --fail-with-body \
    --request PUT \
    --header "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
    --header "Content-Type: application/json" \
    --data @- \
    "$sentry_url/api/0/organizations/$SENTRY_ORG/issues/$sentry_id/" >/dev/null

echo "Sentry issue $sentry_id is now $status."
