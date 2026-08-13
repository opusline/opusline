<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceEvent;
use Carbon\CarbonImmutable;

class RecordInvoiceEvent
{
    public function handle(
        Invoice $invoice,
        InvoiceEventKind $kind,
        ?CarbonImmutable $occurredOn = null,
        ?string $note = null,
    ): InvoiceEvent {
        return $invoice->events()->create([
            'kind' => $kind,
            'occurred_on' => $occurredOn ?? CarbonImmutable::today(),
            'note' => $note,
        ]);
    }
}
