#!/usr/bin/env sh
# Fails when a French literal sneaks into the UI source instead of the message
# catalogs. Accented characters are a high-precision detector, not a complete
# one — "Mission", "Total" and "Ajouter" carry none. What covers the rest is
# week-page-english.test.tsx, which renders the primary screen at `en` and reads
# back what it says. Keep both.
#
# packages/ui is in scope too: the design system holds no domain vocabulary at
# all, so anything matched there is a bug by definition.
#
# File exemptions are expressed where grep scopes files so content can never
# trigger them: stories/tests/fixtures (French fixture copy is deliberate), the
# compiled paraglide output, and the CRA document preview (it mirrors the French
# PDF). Line exemptions: comments, and the single named opt-out `// i18n-ignore`
# for deliberate literals such as a language named in itself.
set -eu

cd "$(dirname "$0")/.."

# Beyond the accented range: the ligature, the guillemets the app's own French
# copy uses, and the typographic apostrophe.
FRENCH_CHARACTERS="[à-üÀ-ÜœŒ«»’]"

matches=$(grep -rnP "$FRENCH_CHARACTERS" apps/web/src packages/ui/src \
  --include="*.ts" --include="*.tsx" \
  --exclude='*.stories.*' --exclude='*.test.*' --exclude='*fixture*' \
  --exclude='story-router.tsx' --exclude='settings-form-story.tsx' \
  --exclude-dir=paraglide --exclude-dir=test \
  | grep -v '^apps/web/src/features/cra/components/cra-document.tsx:' \
  | grep -vP ':\d+:\s*(//|\*|/\*)' \
  | grep -v '// i18n-ignore$' || true)

if [ -n "$matches" ]; then
  echo "French literals outside the message catalogs — move them to apps/web/messages, or suffix a deliberate line with // i18n-ignore:" >&2
  echo "$matches" >&2
  exit 1
fi
