<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** How often an unpaid invoice is reminded about once its due date has passed. */
enum ReminderFrequency: int
{
    case OnceDayAfterDue = 0;
    case DayThreeAndTen = 1;
    case WeeklyUntilPaid = 2;
}
