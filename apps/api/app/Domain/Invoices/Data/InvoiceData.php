<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\NetIncome;
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
        /**
         * What reaches the personal account from this invoice (since 0.33.7): `amountHt`
         * less the URSSAF settlement (cotisations, CFP, and the versement libératoire when
         * the option is on) at the rate of the declaration period it is collected in, and,
         * without the versement libératoire, less the income tax at the withholding rate on
         * `amountHt` minus the 34 % micro-BNC abatement. The TVA is not in `amountHt` to
         * begin with; the CFE, subscriptions and matelas are not deducted. A paid invoice
         * is priced on its `paidOn`, any other on today. Null for a draft, and for an
         * account outside French fiscality.
         */
        public ?MoneyData $amountNet,
        public bool $ttcOverridden,
        public int $vatRateBp,
        public ?string $notes,
    ) {}

    public static function fromModel(Invoice $invoice, ?NetIncome $netIncome): self
    {
        $amountNet = $netIncome?->ofInvoice($invoice);

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
            amountNet: $amountNet === null ? null : MoneyData::fromMoney($amountNet),
            ttcOverridden: $invoice->isTtcOverridden(),
            vatRateBp: $invoice->vat_rate_bp,
            notes: $invoice->notes,
        );
    }
}
