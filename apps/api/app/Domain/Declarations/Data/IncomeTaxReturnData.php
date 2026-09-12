<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Declarations\Enums\IncomeTaxReturnBox;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * The 2042-C PRO sheet for one year of income: the gross receipts to
 * retype, the box they go in, and what they add up to once the micro-BNC
 * abatement is taken — an estimate, since the household's other income
 * sets the rate.
 */
class IncomeTaxReturnData extends Data
{
    /**
     * @param  list<IncomeTaxReturnPeriodData>  $periods  the year's URSSAF declarations, oldest first
     */
    public function __construct(
        public int $year,
        /** Estimated: the fisc publishes the exact day each April. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /** Recettes brutes encaissées — HT collected over the year, the figure the box asks for. */
        public MoneyData $grossReceipts,
        public IncomeTaxReturnBox $box,
        #[DataCollectionOf(IncomeTaxReturnPeriodData::class)]
        public array $periods,
        /** The receipts less the 34 % abatement (at least 305 €) — what joins the taxable income. */
        public MoneyData $taxableAfterAbatement,
        /** What the versement libératoire already settled; null without the option. */
        public ?MoneyData $liberatingPaymentPaid,
        public ?DeclarationCompletionData $completion,
    ) {}
}
