<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Settings\Models\UserSettings;
use Spatie\LaravelData\Data;

/** What a new invoice starts with for its automatic payment reminders. */
class ReminderDefaultsData extends Data
{
    public function __construct(
        public bool $enabled,
        public ReminderFrequency $frequency,
    ) {}

    public static function fromSettings(UserSettings $settings): self
    {
        return new self(
            enabled: $settings->reminders_default_enabled,
            frequency: $settings->reminders_default_frequency,
        );
    }
}
