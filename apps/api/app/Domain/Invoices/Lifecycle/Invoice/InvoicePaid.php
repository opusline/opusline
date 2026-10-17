<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Lifecycle\Invoice;

use App\Domain\Invoices\Enums\InvoiceStatus;

class InvoicePaid extends InvoiceLifecycle
{
    #[\Override]
    public static function status(): InvoiceStatus
    {
        return InvoiceStatus::Paid;
    }
}
