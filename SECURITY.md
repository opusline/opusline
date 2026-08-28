# Security policy

Opusline holds invoices, URSSAF and TVA declarations, and imported bank
movements. If you find a way to reach someone else's, we want to hear about it
before anyone else does.

## Reporting a vulnerability

**Use GitHub's private vulnerability reporting**:
[open a draft advisory](https://github.com/opusline/opusline/security/advisories/new).
It is private to you and the maintainer, and it becomes the advisory if the
report is confirmed.

Please do not open a public issue for a vulnerability. Issues are world-readable
the moment they are filed, which publishes the problem to every unpatched
instance at once.

A useful report says what you did, what happened, and what you expected — a
request or a diff is worth more than a paragraph. If you are unsure whether
something counts, report it; deciding is our job.

You will get a first response within 7 days. If a report is confirmed, expect a
fix and an advisory; you will be credited unless you would rather not be.

## What is in scope

Anything that lets one account read or write another's data, that escapes the
route bindings ownership rests on, that leaks a calendar token or an uploaded
document, or that turns an import into code execution.

Out of scope: findings that need an attacker who already has your database or
your `APP_KEY`, missing hardening headers on a self-hosted deployment you
configured yourself, and automated scanner output with no demonstrated impact.

## Supported versions

Opusline is pre-1.0 and single-maintainer. Fixes land on `main` and in the next
release; there are no backports to older tags. If you self-host, follow the
releases — see [docs/self-hosting.md](docs/self-hosting.md) for how upgrades
work.

## If you self-host

The instance is yours, and so is its exposure. Two things carry most of it:
keep `APP_KEY` secret and unchanged, and put the stack behind TLS with the
headers `docs/self-hosting.md` describes — without them the session cookie is
issued without its `Secure` attribute.
