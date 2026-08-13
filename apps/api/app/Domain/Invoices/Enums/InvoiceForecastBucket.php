<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * The bars of "Attendu sur 60 jours".
 *
 * Money already late is not one of them: it is not expected, it is missing, and it
 * is reported on its own as `overdue`. Keeping it here would both duplicate that
 * figure and scale the bars against a bar nobody draws.
 */
enum InvoiceForecastBucket: int
{
    case Next30 = 1;
    case Next60 = 2;
}
