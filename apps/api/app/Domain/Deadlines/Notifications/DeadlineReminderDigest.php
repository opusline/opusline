<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Notifications;

use App\Domain\Deadlines\Calendar\DeadlineReminderLine;
use App\Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeadlineReminderDigest extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  non-empty-list<DeadlineReminderLine>  $lines
     */
    public function __construct(public readonly array $lines) {}

    /**
     * @return list<string>
     */
    public function via(User $notifiable): array
    {
        if (! config()->boolean('mail.enabled')) {
            return [];
        }

        return $notifiable->settingsOrFail()->mail_deadline_reminders ? ['mail'] : [];
    }

    public function toMail(): MailMessage
    {
        $message = (new MailMessage)
            ->subject(trans_choice('mail.deadlines.subject', count($this->lines)))
            ->line(__('mail.deadlines.intro'));

        foreach ($this->lines as $line) {
            $message->line($this->sentenceFor($line));
        }

        return $message
            ->action(__('mail.deadlines.action'), config()->string('app.frontend_url').'/deadlines')
            ->line(__('mail.deadlines.footer'));
    }

    private function sentenceFor(DeadlineReminderLine $line): string
    {
        $deadline = $line->amount === null
            ? $line->title
            : __('mail.deadlines.with_amount', ['title' => $line->title, 'amount' => $line->amount]);

        return match ($line->leadDays) {
            0 => __('mail.deadlines.due_today', ['deadline' => $deadline]),
            1 => __('mail.deadlines.due_tomorrow', ['deadline' => $deadline]),
            default => __('mail.deadlines.due_in_days', [
                'deadline' => $deadline,
                'days' => $line->leadDays,
                'date' => $line->dueOn->isoFormat('LL'),
            ]),
        };
    }
}
