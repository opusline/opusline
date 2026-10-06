<?php

declare(strict_types=1);

namespace App\Domain\Users\Notifications;

use App\Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Encrypted on the queue: the token is a credential for as long as it lives,
 * and a queued job sits in Redis — and in failed_jobs when the relay refuses it.
 */
class ResetPasswordLink extends Notification implements ShouldBeEncrypted, ShouldQueue
{
    use Queueable;

    public function __construct(
        #[\SensitiveParameter]
        public readonly string $token,
    ) {}

    /**
     * @return list<string>
     */
    public function via(): array
    {
        return config()->boolean('mail.enabled') ? ['mail'] : [];
    }

    public function toMail(User $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('mail.password_reset.subject'))
            ->line(__('mail.password_reset.line'))
            ->action(__('mail.password_reset.action'), $this->resetUrl($notifiable))
            ->line(__('mail.password_reset.expires', ['count' => config()->integer('auth.passwords.users.expire')]))
            ->line(__('mail.password_reset.not_you'));
    }

    private function resetUrl(User $notifiable): string
    {
        return config()->string('app.frontend_url').'/reset-password?'.http_build_query([
            'token' => $this->token,
            'email' => $notifiable->email,
        ]);
    }
}
