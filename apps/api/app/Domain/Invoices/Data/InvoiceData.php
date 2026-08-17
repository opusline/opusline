<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Clients\Enums\VatTreatment;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class InvoiceData extends Data
{
    public function __construct(
        public int $id,
        public int $clientId,
        public ?int $missionId,
        public ?string $number,
        public InvoiceStatus $status,
        public bool $isLate,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $issuedOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $paidOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $periodStart,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $periodEnd,
        public MoneyData $amountHt,
        public MoneyData $amountVat,
        public MoneyData $amountTtc,
        public bool $ttcOverridden,
        public int $vatRateBp,
        /** Which VAT rule applied when the invoice was drawn up. */
        public VatTreatment $vatTreatment,
        public ?string $notes,
    ) {}

    public static function fromModel(Invoice $invoice): self
    {
        return new self(
            id: $invoice->id,
            clientId: $invoice->client_id,
            missionId: $invoice->mission_id,
            number: $invoice->number,
            status: $invoice->status,
            isLate: $invoice->isLate(),
            issuedOn: $invoice->issued_on,
            dueOn: $invoice->due_on,
            paidOn: $invoice->paid_on,
            periodStart: $invoice->period_start,
            periodEnd: $invoice->period_end,
            amountHt: MoneyData::fromMoney($invoice->amount_ht_cents),
            amountVat: MoneyData::fromMoney($invoice->vatAmount()),
            amountTtc: MoneyData::fromMoney($invoice->amount_ttc_cents),
            ttcOverridden: $invoice->isTtcOverridden(),
            vatRateBp: $invoice->vat_rate_bp,
            vatTreatment: $invoice->vat_treatment,
            notes: $invoice->notes,
        );
    }
}
