# The Opusline browser extension

The Déclarations page computes what the URSSAF and the CA3 ask for, but the
portals have no filing API. The extension closes that gap: a « Pré-remplir »
link on a declaration card opens the portal with the figures in the URL, and
once you have logged in and reached the form, the extension types them in and
shows a banner listing what it filled. **It never submits anything** — you
review the form and file it yourself.

Chrome and Firefox are supported. The extension is not on the Chrome Web
Store or on addons.mozilla.org yet; it installs from the zip attached to each
[release](https://github.com/opusline/opusline/releases).

## Install

Download `opusline-extension-chrome-<version>.zip` or
`opusline-extension-firefox-<version>.zip` from the release matching your
instance, then unzip it.

**Chrome** — open `chrome://extensions`, turn on *Developer mode*, click
*Load unpacked* and pick the unzipped folder. Every site the extension needs
is granted at install.

**Firefox** — open `about:debugging#/runtime/this-firefox`, click *Load
Temporary Add-on…* and pick `manifest.json` in the unzipped folder. Then in
`about:addons`, open the extension's *Permissions* tab and allow access to
`urssaf.fr` and `impots.gouv.fr`: a temporary add-on is not granted its sites
automatically. Temporary add-ons are removed when Firefox quits; a permanent
install needs a build signed by Mozilla, which is not available yet.

## Using it

1. On `/declarations`, pick the period, then click « Pré-remplir sur
   autoentrepreneur.urssaf.fr » or « Pré-remplir sur impots.gouv.fr ». The
   portal opens in a new tab on its public landing page.
2. Log in and navigate to the declaration form as usual.
3. When the form appears, the fields are filled and a banner at the top right
   says which ones were, and which were skipped because the portal did not
   show them or had locked them. Check every amount, complete anything the
   banner lists as skipped, then file.

The figures wait in the extension for seven days at most; a link clicked on a
Monday still fills the form on the Friday. Once filled, or once expired, they
are discarded — click « Pré-remplir » again to redo a form.

## What leaves your browser

Nothing. The figures travel from your Opusline tab to the portal tab inside
the URL fragment (the part after `#`, which browsers never send to servers),
are stripped from the address bar before the portal's own scripts run, and sit
in the extension's local storage until they are typed. No identifier goes
with them: whole-euro amounts and the period, that is all. The extension has
no server side and collects no data.

## When the banner never shows

The portals redesign their forms without notice. If the form appears but
nothing is filled, the field the extension looks for has probably been
renamed. Please [open an issue](https://github.com/opusline/opusline/issues)
with the page's HTML captured as described in
[`apps/extension/fixtures/README.md`](../apps/extension/fixtures/README.md),
sanitized of anything personal — that capture is what the fix is tested
against.

## Developing

```bash
pnpm --filter @opusline/extension build            # dist/chrome and dist/firefox
pnpm --filter @opusline/extension test             # Vitest against the captured forms
pnpm --filter @opusline/extension build:harness    # dist/*-dev, also matching localhost
pnpm --filter @opusline/extension harness          # serves fixtures/ on http://localhost:4173
```

Load `dist/chrome-dev` (or `dist/firefox-dev`) and open the harness: each
link carries a sample payload into a captured form, so the whole flow can be
walked without a portal login.
