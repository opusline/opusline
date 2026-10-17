<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Invoices\Actions\SendDueReminders;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

#[Description('E-mail the clients whose unpaid invoices reach a reminder day today')]
#[Signature('invoices:send-reminders')]
class SendPaymentReminders extends Command
{
    public function handle(SendDueReminders $sendDueReminders): int
    {
        if (! config()->boolean('mail.enabled')) {
            $this->components->info('This instance has no mailer: no reminder to send.');

            return self::SUCCESS;
        }

        $sent = 0;
        $crashed = 0;

        User::query()
            ->whereHas('invoices', fn ($invoices) => $invoices->where('reminders_enabled', true)->where('status', InvoiceStatus::Sent))
            ->with('settings')
            ->chunkById(50, function (Collection $batch) use ($sendDueReminders, &$sent, &$crashed): void {
                foreach ($batch as $user) {
                    try {
                        $sent += $sendDueReminders->handle($user);
                    } catch (Throwable $exception) {
                        // One account's bug must not cost everyone else their reminders.
                        $crashed++;
                        report($exception);
                    }
                }
            });

        $this->components->info("Sent {$sent} payment reminder(s), {$crashed} account(s) failed.");

        return $crashed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
