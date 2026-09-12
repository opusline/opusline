<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/** One square of the twelve-month strip. */
enum SubscriptionOccurrenceState: int
{
    /** The debit has its expense and the expense its receipt. */
    case Linked = 0;
    /** The debit has its expense, still waiting for the receipt. */
    case Missing = 1;
    case Future = 2;
    /** A future debit that will not happen while the subscription is paused. */
    case Paused = 3;
    /** A past debit with no expense — before the subscription was recorded, or not auto-created. */
    case Inactive = 4;
}
