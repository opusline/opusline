<?php

declare(strict_types=1);

namespace App\Domain\Users\Notifications;

use App\Domain\TwoFactor\Devices\UserAgentLabel;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SecurityAlert extends Notification implements ShouldQueue, ShouldQueueAfterCommit
{
    use Queueable;

    public readonly CarbonImmutable $occurredAt;

    /**
     * Where it happened is captured by the caller, and when by the
     * constructor: the mail is written later by a queue worker, which has no
     * request to read either from.
     */
    public function __construct(
        public readonly SecurityAlertKind $kind,
        public readonly ?string $ip,
        public readonly ?string $userAgent,
        /**
         * Where to mail the alert when that is not the address the account
         * signs in with by the time it is sent. See User::routeNotificationForMail.
         */
        public readonly ?string $recipient = null,
    ) {
        $this->occurredAt = CarbonImmutable::now();
    }

    public static function duringRequest(SecurityAlertKind $kind, ?string $recipient = null): self
    {
        return new self($kind, request()->ip(), request()->userAgent(), $recipient);
    }

    /**
     * Resolved when the alert is dispatched, not when it is delivered — which
     * is what lets the alert about turning alerts off still go out.
     *
     * @return list<string>
     */
    public function via(User $notifiable): array
    {
        if (! config()->boolean('mail.enabled')) {
            return [];
        }

        return $notifiable->settingsOrFail()->mail_security_alerts ? ['mail'] : [];
    }

    public function toMail(User $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject(__("mail.security.kind.{$this->kind->name}.subject"))
            ->line(__("mail.security.kind.{$this->kind->name}.line", ['email' => $notifiable->email]))
            ->line(__('mail.security.when', ['time' => $this->occurredAtFor($notifiable)]));

        $device = $this->deviceLabel();

        if ($device !== null) {
            $message->line(__('mail.security.device', ['device' => $device]));
        }

        if ($this->ip !== null) {
            $message->line(__('mail.security.ip', ['ip' => $this->ip]));
        }

        return $message
            ->line(__('mail.security.not_you'))
            ->action(
                __('mail.security.action'),
                config()->string('app.frontend_url').'/settings?tab='.$this->settingsTab(),
            );
    }

    /** The settings tab where the owner reviews, or undoes, what the alert reports. */
    private function settingsTab(): string
    {
        return $this->kind === SecurityAlertKind::AlertsTurnedOff ? 'notifications' : 'securite';
    }

    private function occurredAtFor(User $notifiable): string
    {
        $timezone = $notifiable->settingsOrFail()->timezone;

        return $this->occurredAt->setTimezone($timezone)->isoFormat('LLL').' ('.$timezone.')';
    }

    private function deviceLabel(): ?string
    {
        $label = UserAgentLabel::parse($this->userAgent);

        if ($label->browser === null) {
            return $label->platform;
        }

        return $label->platform === null ? $label->browser : "{$label->browser} ({$label->platform})";
    }
}
