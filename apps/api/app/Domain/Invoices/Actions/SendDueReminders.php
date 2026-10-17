<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Reminders\ReminderSchedule;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * The reminders an account owes today: every unpaid invoice that asked for
 * them and whose next reminder day has come, once the account's morning has
 * started and at most once a day each. Returns how many left.
 */
class SendDueReminders
{
    /** Account-local hour from which the day's reminders may leave. */
    private const int MAIL_HOUR = 9;

    public function __construct(private readonly SendPaymentReminder $sendPaymentReminder) {}

    public function handle(User $user): int
    {
        $settings = $user->settingsOrFail();

        if (CarbonImmutable::now($settings->timezone)->hour < self::MAIL_HOUR) {
            return 0;
        }

        $today = $settings->today();
        $sent = 0;

        $user->invoices()
            ->where('status', InvoiceStatus::Sent)
            ->where('reminders_enabled', true)
            ->where('due_on', '<', $today)
            ->with('emails')
            ->orderBy('id')
            ->each(function (Invoice $invoice) use ($user, $today, &$sent): void {
                if (! $this->isDueToday($invoice, $today)) {
                    return;
                }

                try {
                    $this->sendPaymentReminder->handle($user, $invoice);
                    $sent++;
                } catch (HttpException) {
                    // No recipients or no PDF: the page says so; the schedule has nothing to add.
                }
            });

        return $sent;
    }

    private function isDueToday(Invoice $invoice, CarbonImmutable $today): bool
    {
        $reminders = $invoice->emails->filter(static fn (DocumentEmail $email): bool => $email->kind === EmailTemplateKind::PaymentReminder);

        if ($reminders->contains(static fn (DocumentEmail $email): bool => $email->sent_at->isSameDay($today))) {
            return false;
        }

        $nextOn = ReminderSchedule::nextOn($invoice->reminders_frequency, $invoice->due_on, $reminders->count());

        return $nextOn instanceof CarbonImmutable && $nextOn->lessThanOrEqualTo($today);
    }
}
