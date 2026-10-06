<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Deadlines\Actions\SendDeadlineReminderDigest;
use App\Domain\Users\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

#[Description('Email each account the deadlines that reach a reminder lead today')]
#[Signature('deadlines:send-reminders')]
class SendDeadlineReminders extends Command
{
    public function handle(SendDeadlineReminderDigest $sendDeadlineReminderDigest): int
    {
        if (! config()->boolean('mail.enabled')) {
            $this->components->info('This instance has no mailer: no reminder to send.');

            return self::SUCCESS;
        }

        $sent = 0;
        $crashed = 0;

        User::query()
            ->whereRelation('settings', 'mail_deadline_reminders', true)
            ->with('settings')
            ->chunkById(50, function (Collection $batch) use ($sendDeadlineReminderDigest, &$sent, &$crashed): void {
                foreach ($batch as $user) {
                    try {
                        $sent += (int) $sendDeadlineReminderDigest->handle($user);
                    } catch (Throwable $exception) {
                        // One account's bug must not cost everyone else their reminders.
                        $crashed++;
                        report($exception);
                    }
                }
            });

        $this->components->info("Sent {$sent} deadline reminder email(s), {$crashed} failed.");

        return $crashed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
