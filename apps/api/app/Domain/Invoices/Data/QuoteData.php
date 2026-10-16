<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class QuoteData extends Data
{
    public function __construct(
        public int $id,
        public int $clientId,
        public ?int $missionId,
        public ?string $number,
        public QuoteStatus $status,
        /** Sent, undecided and past its validity: derived, never stored. */
        public bool $isExpired,
        public ?string $title,
        public DocumentLanguage $language,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $issuedOn,
        public int $validityDays,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $validUntil,
        /** Share of the total incl. VAT due on acceptance; null when none is asked. */
        public ?int $depositRateBp,
        public ?MoneyData $depositAmount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $acceptedOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $refusedOn,
        public MoneyData $amountHt,
        public MoneyData $amountVat,
        public MoneyData $amountTtc,
        public int $vatRateBp,
    ) {}

    public static function fromModel(Quote $quote): self
    {
        return new self(
            id: $quote->id,
            clientId: $quote->client_id,
            missionId: $quote->mission_id,
            number: $quote->number,
            status: $quote->status,
            isExpired: $quote->isExpired(),
            title: $quote->title,
            language: $quote->language ?? DocumentLanguage::French,
            issuedOn: $quote->issued_on,
            validityDays: $quote->validity_days,
            validUntil: $quote->valid_until,
            depositRateBp: $quote->deposit_rate_bp,
            depositAmount: $quote->deposit_rate_bp === null ? null : MoneyData::fromMoney(Rate::of($quote->amount_ttc_cents, $quote->deposit_rate_bp)),
            acceptedOn: $quote->accepted_on,
            refusedOn: $quote->refused_on,
            amountHt: MoneyData::fromMoney($quote->amount_ht_cents),
            amountVat: MoneyData::fromMoney($quote->vatAmount()),
            amountTtc: MoneyData::fromMoney($quote->amount_ttc_cents),
            vatRateBp: $quote->vat_rate_bp,
        );
    }
}
