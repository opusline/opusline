<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * The two ways a freelancer reads their revenue: by what was invoiced, or by what
 * actually landed. URSSAF declares on the cash basis; the invoiced basis is the
 * activity view.
 */
enum RevenueBasis: int
{
    /** Issued invoices, summed on their issue date. */
    case Invoiced = 0;

    /** Paid invoices, summed on their payment date. */
    case Collected = 1;
}
