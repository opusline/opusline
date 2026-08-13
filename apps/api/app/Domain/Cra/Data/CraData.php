<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class CraData extends Data
{
    /**
     * @param  list<CraDayData>  $days
     * @param  float  $differenceDays  Reported minus tracked. Non-zero is the écart the
     *                                 screen surfaces — a clamped overtime day shows here.
     */
    public function __construct(
        public int $id,
        public int $missionId,
        /** The covered month as `Y-m`, matching how invoice summaries speak of months. */
        public string $month,
        public CraStatus $status,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $sentOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $signedOn,
        public float $totalDays,
        public float $trackedDays,
        public float $differenceDays,
        /** Days times the mission's rate. Null when the mission has no per-day price. */
        public ?MoneyData $estimatedAmount,
        /** Whether the grid has been changed away from what tracked time says. */
        public bool $dirty,
        public bool $editable,
        public ?string $notes,
        #[DataCollectionOf(CraDayData::class)]
        public array $days,
    ) {}
}
