<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Invoice;

class DeleteInvoice
{
    public function __construct(private readonly LockInvoice $lockInvoice) {}

    public function handle(Invoice $invoice): void
    {
        $this->lockInvoice->handle($invoice, function (Invoice $locked): void {
            abort_if($locked->status->isIssued(), 409, __('invoices.cannot_delete_issued'));

            $locked->timeEntries()->update(['invoice_id' => null]);

            $locked->delete();
        });
    }
}
