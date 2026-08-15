#!/usr/bin/env sh
# Fails when a French literal sneaks into apps/web source instead of the
# message catalogs. Accented characters are a high-precision detector; review
# catches the unaccented rest. File exemptions are expressed where grep scopes
# files so content can never trigger them: stories/tests/fixtures (French
# fixture copy is deliberate), the compiled paraglide output, and the CRA
# document preview (it mirrors the French PDF). Line exemptions: comments, and
# the single named opt-out `// i18n-ignore` for deliberate literals such as a
# language named in itself.
set -eu

cd "$(dirname "$0")/.."

matches=$(grep -rnP "[à-üÀ-Ü]" apps/web/src --include="*.ts" --include="*.tsx" \
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
