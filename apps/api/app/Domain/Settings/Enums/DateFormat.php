<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

/**
 * The numeric layout calendar dates are displayed in — 31/08/2026 or
 * 2026-08-31. Weekday and month names stay French until i18n lands; only
 * digit-only dates follow this preference.
 */
enum DateFormat: int
{
    case DayMonthYear = 0;
    case YearMonthDay = 1;
}
