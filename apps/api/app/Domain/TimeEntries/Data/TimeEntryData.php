<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\TimeEntries\Models\TimeEntry;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class TimeEntryData extends Data
{
    public function __construct(
        public int $id,
        public int $missionId,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $date,
        public int $durationMinutes,
        public ?EntryRounding $rounding,
        public ?int $valuedMinutes,
        public ?float $valuedDayFraction,
        /**
         * What the entry bills, HT, or null when its mission prices no time.
         *
         * On the DTO because the quantities above cannot produce it: a day
         * fraction is a float, and a rate multiplied by one is the arithmetic
         * this app keeps out of the browser.
         */
        public ?MoneyData $value,
        public bool $billable,
        /** Whether an invoice already bills this entry, so it can no longer be re-billed. */
        public bool $invoiced,
        public ?string $note,
    ) {}

    public static function fromModel(TimeEntry $timeEntry): self
    {
        $value = $timeEntry->value();

        return new self(
            id: $timeEntry->id,
            missionId: $timeEntry->mission_id,
            date: $timeEntry->date,
            durationMinutes: $timeEntry->duration_minutes,
            rounding: $timeEntry->rounding,
            valuedMinutes: $timeEntry->valuedMinutes(),
            valuedDayFraction: $timeEntry->valuedDayFraction(),
            value: $value instanceof Money ? MoneyData::fromMoney($value) : null,
            billable: $timeEntry->billable,
            invoiced: $timeEntry->isInvoiced(),
            note: $timeEntry->note,
        );
    }
}
