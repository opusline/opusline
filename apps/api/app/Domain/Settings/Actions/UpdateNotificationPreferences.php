<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\UpdateNotificationPreferencesData;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\DB;

class UpdateNotificationPreferences
{
    public function handle(User $user, UpdateNotificationPreferencesData $data): void
    {
        $settings = $user->settingsOrFail();

        DB::transaction(function () use ($user, $settings, $data): void {
            // Before the write: an alert picks its channels from the preference
            // as it stands when notified, and this one has to outlive the
            // switch. Inside the transaction, so it only leaves once the
            // preference is really saved.
            if ($settings->mail_security_alerts && ! $data->securityAlerts) {
                $user->notify(SecurityAlert::duringRequest(SecurityAlertKind::AlertsTurnedOff));
            }

            $settings->update([
                'mail_security_alerts' => $data->securityAlerts,
                'mail_deadline_reminders' => $data->deadlineReminders,
            ]);
        });
    }
}
