<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;

class UpdateNotificationPreferencesData extends Data
{
    public function __construct(
        #[BooleanType]
        public bool $securityAlerts,
        #[BooleanType]
        public bool $deadlineReminders,
    ) {}
}
