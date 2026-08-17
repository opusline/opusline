<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class FiscalDeadlineData extends Data
{
    public function __construct(
        public FiscalDeadlineKind $kind,
        /** The period being declared, as `Y-m` for a month or `Y` for a year. */
        public string $period,
        /** `Y-m-d`, the date the return or payment is due. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /**
         * What the period accrued, on collections — null when the period is not
         * over, because a running month's figure is not the one to declare.
         */
        public ?MoneyData $amount,
        /** Negative once the date has passed. */
        public int $daysUntilDue,
        public bool $isOverdue,
    ) {}
}
