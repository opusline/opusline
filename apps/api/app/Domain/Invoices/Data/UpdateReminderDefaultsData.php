<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\ReminderFrequency;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Data;

class UpdateReminderDefaultsData extends Data
{
    public function __construct(
        #[BooleanType]
        public bool $enabled,
        #[Enum(ReminderFrequency::class)]
        public ReminderFrequency $frequency,
    ) {}
}
