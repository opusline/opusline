<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Revenue;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;

/** How long a client takes to pay, read off its paid invoices. */
final class PaymentDelay
{
    /**
     * Days from issue to the payment that completed each paid invoice, on
     * average; null while none is paid. Expects `last_paid_on` selected, or
     * paidOn() queries once per invoice.
     *
     * @param  iterable<Invoice>  $invoices
     */
    public static function averageDays(iterable $invoices): ?int
    {
        $delays = [];

        foreach ($invoices as $invoice) {
            if ($invoice->status !== InvoiceStatus::Paid) {
                continue;
            }

            $paidOn = $invoice->paidOn();

            if ($paidOn !== null) {
                $delays[] = (int) $invoice->issued_on->diffInDays($paidOn);
            }
        }

        if ($delays === []) {
            return null;
        }

        return (int) round(array_sum($delays) / count($delays));
    }
}
