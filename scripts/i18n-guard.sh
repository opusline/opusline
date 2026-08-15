#!/usr/bin/env sh
# Fails when a French literal sneaks into apps/web source instead of the
# message catalogs. Accented characters are a high-precision detector; review
# catches the unaccented rest. Exempt: stories/tests/fixtures (French fixture
# copy is deliberate), the compiled paraglide output, comment lines, the CRA
# document preview (it mirrors the French PDF), and "Français" (languages are
# named in themselves).
set -eu

cd "$(dirname "$0")/.."

matches=$(grep -rnP "[à-üÀ-Ü]" apps/web/src --include="*.ts" --include="*.tsx" \
  | grep -vE "\.stories\.|\.test\.|fixture|story|/paraglide/|/test/|cra-document\.tsx" \
  | grep -vP ":\d+:\s*(//|\*|/\*)|^\s*\*" \
  | grep -v '"Français"' || true)

if [ -n "$matches" ]; then
  echo "French literals outside the message catalogs — move them to apps/web/messages:" >&2
  echo "$matches" >&2
  exit 1
fi
