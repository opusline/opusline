<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** A mission's billable time no invoice covers yet, as one invoice line. */
class UnbilledTimeData extends Data
{
    /**
     * @param  list<int>  $timeEntryIds
     */
    public function __construct(
        public int $missionId,
        public string $missionName,
        public array $timeEntryIds,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $firstEntryOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $lastEntryOn,
        /** In thousandths of the line's unit: days for a day rate, hours for an hourly one. */
        public int $quantityMilli,
        public LineUnit $unit,
        /** The mission's rate; null for a fixed price, whose time bills nothing on its own. */
        public ?MoneyData $unitPrice,
    ) {}
}
