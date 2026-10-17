<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\ReminderFrequency;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Data;

/** Whether this invoice is reminded about once past due, and at what rhythm. */
class UpdateInvoiceRemindersData extends Data
{
    public function __construct(
        #[BooleanType]
        public bool $enabled,
        #[Enum(ReminderFrequency::class)]
        public ReminderFrequency $frequency,
    ) {}
}
