<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class FiscalDeadlineListData extends Data
{
    /**
     * @param  list<FiscalDeadlineData>  $deadlines  Soonest due first.
     */
    public function __construct(
        #[DataCollectionOf(FiscalDeadlineData::class)]
        public array $deadlines,
        /**
         * Whether a TVA schedule applies that Opusline does not compute — the
         * annual CA12 of the réel simplifié, whose statutory date follows the
         * income-tax season rather than the period. The screen says so rather
         * than leaving the reader to think they owe nothing.
         */
        public bool $hasUncomputedVatSchedule,
    ) {}
}
