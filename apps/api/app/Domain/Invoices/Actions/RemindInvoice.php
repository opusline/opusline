<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\RemindInvoiceData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceEvent;
use Carbon\CarbonImmutable;

class RemindInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice, RemindInvoiceData $data): InvoiceEvent
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($data): InvoiceEvent {
            abort_if(! $locked->status->canBeReminded(), 409, __('invoices.cannot_remind'));

            return $this->recordInvoiceEvent->handle(
                $locked,
                InvoiceEventKind::Reminded,
                $data->occurredOn === null ? null : CarbonImmutable::parse($data->occurredOn),
                $data->note,
            );
        });
    }
}
