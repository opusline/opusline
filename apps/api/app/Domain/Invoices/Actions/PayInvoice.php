<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\PayInvoiceData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use Carbon\CarbonImmutable;

class PayInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice, PayInvoiceData $data): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($data): Invoice {
            // Already paid is not a no-op: correcting the date shifts revenue between
            // declaration periods, so it goes through an explicit edit instead.
            abort_if($locked->status !== InvoiceStatus::Sent, 409, __('invoices.cannot_pay_unless_sent'));

            $paidOn = CarbonImmutable::parse($data->paidOn);

            $locked->update([
                'status' => InvoiceStatus::Paid,
                'paid_on' => $paidOn,
            ]);

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Paid, $paidOn);

            return $locked;
        });
    }
}
