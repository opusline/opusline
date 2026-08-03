<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
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
        public ?MoneyData $rate,
        public MissionStatus $status,
        public ?CarbonImmutable $startDate,
        public ?CarbonImmutable $endDate,
    ) {}

    public static function fromModel(Mission $mission): self
    {
        return new self(
            id: $mission->id,
            slug: $mission->slug,
            clientId: $mission->client_id,
            endClientId: $mission->end_client_id,
            name: $mission->name,
            billingMode: $mission->billing_mode,
            rate: $mission->rate_cents === null
                ? null
                : MoneyData::fromMoney($mission->rate_cents),
            status: $mission->status,
            startDate: $mission->start_date,
            endDate: $mission->end_date,
        );
    }
}
