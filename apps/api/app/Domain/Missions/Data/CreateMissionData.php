<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class CreateMissionData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        public string $name,
        public BillingMode $billingMode,
        public ?MoneyData $rate = null,
        #[IntegerType, Exists('clients', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $endClientId = null,
        #[DateFormat('Y-m-d')]
        public ?string $startDate = null,
        #[DateFormat('Y-m-d'), AfterOrEqual('startDate')]
        public ?string $endDate = null,
    ) {}
}
