<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Declarations\Enums\LiberatingPaymentEndReason;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * Whether the versement libératoire the account pays can go on. The option is
 * never switched off for the user: its end is a 1 January the settings must be
 * changed on, and this says which one, and why.
 */
class LiberatingPaymentOutlookData extends Data
{
    public function __construct(
        /** The 1 January the option stops applying — possibly already past — or null when nothing says it stops. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $endsOn,
        public ?LiberatingPaymentEndReason $reason,
        /** The RFR that ends the option, the year of income it measures, the limit it exceeds and the parts that limit was read for — set only for that reason. */
        public ?MoneyData $referenceTaxIncome,
        public ?int $referenceTaxIncomeYear,
        public ?MoneyData $referenceTaxIncomeLimit,
        public ?int $taxHouseholdQuarterParts,
        /** The micro-BNC ceiling crossed two years running — set only for that reason. */
        public ?MoneyData $ceiling,
        /** No RFR recent enough to vouch for the option: none was entered, or it is older than the one deciding this year. */
        public bool $needsReferenceTaxIncome,
    ) {}
}
