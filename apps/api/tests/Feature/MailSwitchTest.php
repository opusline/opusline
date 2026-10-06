<?php

declare(strict_types=1);

use App\Domain\Deadlines\Calendar\DeadlineReminderLine;
use App\Domain\Deadlines\Notifications\DeadlineReminderDigest;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Carbon\CarbonImmutable;
use Illuminate\Notifications\Notification;

/**
 * One of each notification the app can send. A new class has to be listed
 * here, which is what makes it answer for the rule below.
 *
 * @return array<class-string<Notification>, Notification>
 */
function everyNotification(): array
{
    return [
        SecurityAlert::class => new SecurityAlert(SecurityAlertKind::PasswordChanged, ip: null, userAgent: null),
        DeadlineReminderDigest::class => new DeadlineReminderDigest([
            new DeadlineReminderLine('Déclaration URSSAF — juillet 2026', amount: null, dueOn: CarbonImmutable::parse('2026-08-31'), leadDays: 0),
        ]),
    ];
}

test('every notification class is covered by the mail switch test', function (): void {
    $classes = array_map(
        static fn (string $path): string => 'App\\Domain\\'.basename(dirname($path, 2)).'\\Notifications\\'.basename($path, '.php'),
        glob(app_path('Domain/*/Notifications/*.php')) ?: [],
    );

    expect(array_keys(everyNotification()))->toEqualCanonicalizing($classes);
});

test('no notification leaves an instance that has no mailer', function (): void {
    config()->set('mail.enabled', false);
    $user = User::factory()->create();

    foreach (everyNotification() as $class => $notification) {
        expect($notification->via($user))->toBe([], "{$class} would still be sent");
    }
});
