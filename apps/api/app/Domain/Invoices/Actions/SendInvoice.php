<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;

class SendInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked): Invoice {
            abort_if($locked->status !== InvoiceStatus::Draft, 409, __('invoices.cannot_send_unless_draft'));

            // The reference belongs to whatever issued the document; an invoice that
            // is out in the world without one cannot be reconciled against anything.
            abort_if($locked->number === null, 409, __('invoices.number_required_once_issued'));

            $locked->update(['status' => InvoiceStatus::Sent]);

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Sent, $locked->issued_on);

            return $locked;
        });
    }
}
