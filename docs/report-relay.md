# Report relay

Opusline lets a user report a bug or ask for a feature from inside the app (#630). Every
instance, self-hosted or not, sends those reports to **one relay**: an Opusline instance the
project runs, which files them as issues on `opusline/opusline` through a GitHub App. The
reporters need no GitHub account, and no instance but the relay holds a GitHub credential.

Self-hosters have nothing to set up here. This page is for whoever runs the relay.

## How a report travels

1. The sending instance asks the relay for a challenge: `GET /api/relay/challenge`.
2. It solves the proof of work: a nonce whose `sha256("challenge:nonce")` starts with
   `difficulty` zero bits (18 by default, a fraction of a second of CPU).
3. It posts the report with the challenge and the nonce: `POST /api/relay/reports`.
4. The relay checks the blocklist, the proof and that the challenge is fresh and unused
   (signed, 10 minutes, single use), then files the issue with its type (Bug or Feature).
   The body ends with « Reported from Opusline <version> via the in-app reporter ·
   instance `<id>` ». Search for that line to filter app reports, or to find an instance to block.

Limits: 30 challenges a minute per address, 5 reports an hour per instance and 20 a day per
address. Past them, the relay answers 429.

## Create the GitHub App

1. On GitHub: **opusline** organisation › Settings › Developer settings › GitHub Apps ›
   **New GitHub App**.
   - Name: « Opusline reports » (any free name). Homepage: the project's URL.
   - Webhook: untick **Active**. The relay never receives events.
   - Repository permissions: **Issues: Read and write**. Metadata is read-only and set by default.
   - Where can it be installed: **Only on this account**.
2. Create it, note the **App ID** at the top of its page.
3. **Generate a private key**. A `.pem` file downloads; it is the only copy.
4. **Install App** › install on **opusline** › **Only select repositories** › `opusline`.
   The installation's URL ends with its **installation id**
   (`…/settings/installations/<id>`).

## Turn the relay on

On the relay instance only, add to its `.env`:

```dotenv
RELAY_GITHUB_APP_ID=123456
RELAY_GITHUB_INSTALLATION_ID=98765432
# The whole .pem on one line, its newlines written as \n:
RELAY_GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE…\n-----END RSA PRIVATE KEY-----"
# Optional
RELAY_GITHUB_REPOSITORY=opusline/opusline
RELAY_POW_DIFFICULTY=18
RELAY_BLOCKLIST=          # instance ids or IP addresses, comma-separated
```

Turn the `.pem` into that one line with `awk 'NF {printf "%s\\n", $0}' key.pem`.

The relay routes exist only while all three `RELAY_GITHUB_*` ids are set. Anywhere else they
answer 404.

To check it, `curl https://<relay>/api/relay/challenge` must answer a challenge.
