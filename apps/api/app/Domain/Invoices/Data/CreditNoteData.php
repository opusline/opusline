<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class CreditNoteData extends Data
{
    public function __construct(
        public int $id,
        public int $invoiceId,
        public string $number,
        public CreditNoteStatus $status,
        public CreditNoteKind $kind,
        public CreditNoteReason $reason,
        public ?string $detail,
        public CreditNoteSettlement $settlement,
        public DocumentLanguage $language,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $issuedOn,
        /** The day nothing was left to do on it; null while money is still owed back. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $settledOn,
        public MoneyData $amountHt,
        public MoneyData $amountVat,
        public MoneyData $amountTtc,
    ) {}

    public static function fromModel(CreditNote $creditNote): self
    {
        return new self(
            id: $creditNote->id,
            invoiceId: $creditNote->invoice_id,
            number: $creditNote->number,
            status: $creditNote->status,
            kind: $creditNote->kind,
            reason: $creditNote->reason,
            detail: $creditNote->detail,
            settlement: $creditNote->settlement,
            language: $creditNote->language,
            issuedOn: $creditNote->issued_on,
            settledOn: $creditNote->settled_on,
            amountHt: MoneyData::fromMoney($creditNote->amount_ht_cents),
            amountVat: MoneyData::fromMoney($creditNote->amount_ttc_cents->subtract($creditNote->amount_ht_cents)),
            amountTtc: MoneyData::fromMoney($creditNote->amount_ttc_cents),
        );
    }
}
