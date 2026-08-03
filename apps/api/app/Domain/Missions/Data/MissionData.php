<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

class MissionData extends Data
{
    public function __construct(
        public int $id,
        public string $slug,
        public int $clientId,
        public ?int $endClientId,
        public string $name,
        public BillingMode $billingMode,
        #[MapInputName('rate_cents')]
        public ?MoneyData $rate,
        public MissionStatus $status,
        public ?CarbonImmutable $startDate,
        public ?CarbonImmutable $endDate,
    ) {}
}
