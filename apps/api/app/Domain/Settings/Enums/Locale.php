<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

/**
 * The locale amounts and dates are formatted in — not the UI language, which
 * stays French until i18n lands (TODO.md). FR and EN only for now; a new case
 * is a one-line addition.
 *
 * Case names follow the standard locale identifiers (fr_FR); values are the
 * BCP-47 tags because that is what `Intl.NumberFormat` consumes verbatim.
 */
enum Locale: string
{
    case fr_FR = 'fr-FR';
    case en_US = 'en-US';
}
