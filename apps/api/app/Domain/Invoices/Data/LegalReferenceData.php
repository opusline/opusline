<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\LatePayment\LegalReference;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Currency;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class LegalReferenceData extends Data
{
    /**
     * @param  array<string, string>  $sources  Source URL per topic: legal_interest_rate, late_penalties, mandatory_mentions.
     */
    public function __construct(
        /** The semester the figures apply to, as `2026-H2`. */
        public string $semester,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $checkedOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $nextRevisionOn,
        public int $legalInterestRateBp,
        /** Three times the legal interest rate: no agreed penalty rate may be lower. */
        public int $minimumPenaltyRateBp,
        public int $ecbRateBp,
        /** The ECB rate plus ten points, owed when the invoice states no rate. */
        public int $statutoryPenaltyRateBp,
        public MoneyData $recoveryFee,
        public array $sources,
    ) {}

    public static function fromReference(LegalReference $reference): self
    {
        return new self(
            semester: $reference->semester,
            checkedOn: $reference->checkedOn,
            nextRevisionOn: $reference->nextRevisionOn,
            legalInterestRateBp: $reference->legalInterestRateBp,
            minimumPenaltyRateBp: $reference->minimumPenaltyRateBp(),
            ecbRateBp: $reference->ecbRateBp,
            statutoryPenaltyRateBp: $reference->statutoryPenaltyRateBp(),
            // A French figure: the indemnité is 40 euros whatever the account's currency.
            recoveryFee: MoneyData::fromMoney(new Money($reference->recoveryFeeCents, Currency::EUR->value)),
            sources: $reference->sources,
        );
    }
}
