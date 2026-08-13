<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * The three bars of "Attendu sur 60 jours". Money already late leads, because it is
 * the number that needs acting on rather than waiting for.
 */
enum InvoiceForecastBucket: int
{
    case Late = 0;
    case Next30 = 1;
    case Next60 = 2;
}
