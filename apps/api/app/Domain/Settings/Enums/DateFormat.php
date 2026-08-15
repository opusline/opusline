<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

/**
 * The numeric layout calendar dates are displayed in — 31/08/2026 or
 * 2026-08-31. Only digit-only dates follow this preference; weekday and
 * month names follow the account locale.
 */
enum DateFormat: int
{
    case DayMonthYear = 0;
    case YearMonthDay = 1;
}
