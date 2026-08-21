<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Color;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class CreateMissionData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        public string $name,
        public BillingMode $billingMode,
        public ?MoneyData $rate = null,
        /**
         * The « TJM de référence »: what a tracked day is worth when reading a
         * forfait's consumption. It prices nothing and reaches no invoice.
         */
        public ?MoneyData $referenceDailyRate = null,
        #[Min(1), Max(255)]
        public ?string $endClientName = null,
        public ?EntryRounding $rounding = null,
        public ?bool $craRequired = null,
        public ?Color $color = null,
        public ?string $notes = null,
        #[DateFormat('Y-m-d')]
        public ?string $startDate = null,
        #[DateFormat('Y-m-d'), AfterOrEqual('startDate')]
        public ?string $endDate = null,
    ) {}
}
