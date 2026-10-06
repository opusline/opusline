<?php

declare(strict_types=1);

namespace App\Domain\Settings\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * One of the two emails a mail test sends. The first is handed to the relay
 * during the request, so a refusal can be shown at once; the second takes the
 * queue, the road every real alert and reminder takes, and only arrives when a
 * worker is running. Which of the two arrive is the diagnosis.
 */
class TestEmail extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly bool $isQueued) {}

    /**
     * @return list<string>
     */
    public function via(): array
    {
        return config()->boolean('mail.enabled') ? ['mail'] : [];
    }

    public function toMail(): MailMessage
    {
        $leg = $this->isQueued ? 'queued' : 'direct';

        return (new MailMessage)
            ->subject(__("mail.test.{$leg}.subject"))
            ->line(__("mail.test.{$leg}.line"))
            ->line(__('mail.test.both'));
    }
}
