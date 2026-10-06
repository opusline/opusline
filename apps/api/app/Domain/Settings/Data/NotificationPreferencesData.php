<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Settings\Models\UserSettings;
use Spatie\LaravelData\Data;

class NotificationPreferencesData extends Data
{
    public function __construct(
        public bool $securityAlerts,
        public bool $deadlineReminders,
    ) {}

    public static function fromSettings(UserSettings $settings): self
    {
        return new self(
            securityAlerts: $settings->mail_security_alerts,
            deadlineReminders: $settings->mail_deadline_reminders,
        );
    }
}
