<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\PayInvoiceData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Lifecycle\Invoice\InvoicePaid;
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
            abort_unless($locked->lifecycle->canTransitionTo(InvoicePaid::class), 409, __('invoices.cannot_pay_unless_sent'));

            $paidOn = CarbonImmutable::parse($data->paidOn);

            abort_if($paidOn->isBefore($locked->issued_on), 409, __('invoices.paid_on_before_issued'));

            $locked->fill(['paid_on' => $paidOn]);
            $locked->lifecycle->transitionTo(InvoicePaid::class);

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Paid, $paidOn);

            return $locked;
        });
    }
}
