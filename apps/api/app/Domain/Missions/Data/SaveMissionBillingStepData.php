<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class SaveMissionBillingStepData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        public string $label,
        public MoneyData $amount,
        #[DateFormat('Y-m-d')]
        public ?string $dueOn = null,
    ) {}
}
