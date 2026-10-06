<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Notifications\DeadlineReminderDigest;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

class SendDeadlineReminderDigest
{
    /**
     * The account-local hour from which the day's reminder email may leave:
     * early enough to plan the day around it, late enough not to wake a phone.
     */
    private const int MAIL_HOUR = 7;

    public function __construct(private readonly ListDeadlineReminderLines $listDeadlineReminderLines) {}

    /**
     * Emails the account today's reminders, once per account-local day and not
     * before its morning. Returns whether a mail was handed to the mailer.
     */
    public function handle(User $user): bool
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();

        if ($settings->deadline_reminders_mailed_on?->greaterThanOrEqualTo($today)) {
            return false;
        }

        if (CarbonImmutable::now($settings->timezone)->hour < self::MAIL_HOUR) {
            return false;
        }

        $lines = $this->listDeadlineReminderLines->handle($user);

        // Notified before the day is marked done, and not in one transaction
        // with it: a mail that could not be queued must be tried again at the
        // next run, and a reminder sent twice is the lesser failure.
        if ($lines !== []) {
            $user->notify(new DeadlineReminderDigest($lines));
        }

        // Not fillable on purpose: this action is the watermark's only writer.
        $settings->forceFill(['deadline_reminders_mailed_on' => $today])->save();

        return $lines !== [];
    }
}
