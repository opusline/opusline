<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\SendInvoiceData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Lifecycle\Invoice\InvoiceSent;
use App\Domain\Invoices\Models\Invoice;
use Carbon\CarbonImmutable;

class SendInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice, SendInvoiceData $data): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($data): Invoice {
            abort_unless($locked->lifecycle->canTransitionTo(InvoiceSent::class), 409, __('invoices.cannot_send_unless_draft'));
            // An Opusline draft is issued by validating it, which numbers it.
            abort_if($locked->isWrittenInOpusline(), 409, __('invoices.validate_before_send'));

            // The reference belongs to whatever issued the document; an invoice that
            // is out in the world without one cannot be reconciled against anything.
            abort_if($locked->number === null, 409, __('invoices.number_required_once_issued'));

            $sentOn = $data->sentOn === null
                ? $locked->issued_on
                : CarbonImmutable::parse($data->sentOn);

            abort_if($sentOn->isBefore($locked->issued_on), 409, __('invoices.sent_on_before_issued'));

            $locked->lifecycle->transitionTo(InvoiceSent::class);

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Sent, $sentOn);

            return $locked;
        });
    }
}
