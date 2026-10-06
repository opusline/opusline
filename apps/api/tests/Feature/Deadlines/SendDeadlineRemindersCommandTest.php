<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Notifications\DeadlineReminderDigest;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Notification;

/**
 * A default account declares URSSAF monthly, and July's return falls due on
 * 31 August 2026: the one deadline these tests walk up to.
 */
const JULY_URSSAF_DUE_ON = '2026-08-31';

function travelToUtc(string $moment): void
{
    test()->travelTo(CarbonImmutable::parse($moment, 'UTC'));
}

/** @return list<int> */
function leadDaysMailedTo(User $user): array
{
    $leadDays = [];

    Notification::assertSentTo($user, DeadlineReminderDigest::class, function (DeadlineReminderDigest $digest) use (&$leadDays): bool {
        $leadDays = array_column($digest->lines, 'leadDays');

        return true;
    });

    return $leadDays;
}

beforeEach(fn () => Notification::fake());

test('emails a deadline on each of its reminder days', function (string $today, int $leadDays): void {
    travelToUtc("{$today} 12:00:00");
    $user = User::factory()->create();

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    expect(leadDaysMailedTo($user))->toBe([$leadDays]);
})->with([
    'a week before' => ['2026-08-24', 7],
    'the day before' => ['2026-08-30', 1],
    'the day itself' => [JULY_URSSAF_DUE_ON, 0],
]);

test('stays quiet on the days in between', function (string $today): void {
    travelToUtc("{$today} 12:00:00");
    User::factory()->create();

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertNothingSent();
})->with([
    'between two leads' => ['2026-08-27'],
    'once the deadline is past' => ['2026-09-02'],
]);

test('emails an account once a day, however often the command runs', function (): void {
    travelToUtc('2026-08-24 12:00:00');
    $user = User::factory()->create();

    $this->artisan('deadlines:send-reminders')->assertSuccessful();
    travelToUtc('2026-08-24 13:00:00');
    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertSentToTimes($user, DeadlineReminderDigest::class, 1);
});

test('waits for the morning of the account, not of the server', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['timezone' => 'Europe/Paris']);

    // 06:30 in Paris: the day has started on the calendar, not for its owner.
    travelToUtc('2026-08-24 04:30:00');
    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertNothingSent();
    expect($user->settings()->sole()->deadline_reminders_mailed_on)->toBeNull();

    travelToUtc('2026-08-24 05:30:00');
    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertSentToTimes($user, DeadlineReminderDigest::class, 1);
});

test('a reminder that could not be handed over is tried again at the next run', function (): void {
    travelToUtc('2026-08-24 12:00:00');
    $user = User::factory()->create();
    Notification::shouldReceive('send')->once()->andThrow(new RuntimeException('The queue is unreachable.'));

    $this->artisan('deadlines:send-reminders')->assertFailed();

    expect($user->settings()->sole()->deadline_reminders_mailed_on)->toBeNull();
});

test('a day with nothing to say is still a day done', function (): void {
    travelToUtc('2026-08-27 12:00:00');
    $user = User::factory()->create();

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    expect($user->settings()->sole()->deadline_reminders_mailed_on?->toDateString())->toBe('2026-08-27');
});

test('leaves out a deadline already ticked off', function (): void {
    travelToUtc('2026-08-24 12:00:00');
    $user = User::factory()->create();
    markDeclared($user, FiscalDeadlineKind::UrssafDeclaration, '2026-07')->assertSuccessful();

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertNothingSent();
});

test('names an unpaid invoice reaching its due date', function (): void {
    travelToUtc('2026-08-27 12:00:00');
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory) => $factory->sent()->state([
        'number' => 'F-2026-014',
        'due_on' => '2026-08-28',
    ]));

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertSentTo($user, DeadlineReminderDigest::class, fn (DeadlineReminderDigest $digest): bool => count($digest->lines) === 1
        && $digest->lines[0]->leadDays === 1
        && str_contains($digest->lines[0]->title, 'F-2026-014'));
});

test('says nothing of an invoice that is paid or still a draft', function (callable $configure): void {
    travelToUtc('2026-08-27 12:00:00');
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory) => $configure($factory)->state(['due_on' => '2026-08-28']));

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertNothingSent();
})->with([
    'paid' => [fn (InvoiceFactory $factory): InvoiceFactory => $factory->paid()],
    'draft' => [fn (InvoiceFactory $factory): InvoiceFactory => $factory],
]);

test('an account outside France is reminded of its invoices alone', function (): void {
    travelToUtc('2026-08-24 12:00:00');
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'BE']);
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory) => $factory->sent()->state(['due_on' => JULY_URSSAF_DUE_ON]));

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    expect(leadDaysMailedTo($user))->toBe([7]);
});

test('an account that turned the reminders off receives none', function (): void {
    travelToUtc('2026-08-24 12:00:00');
    $user = User::factory()->create();
    $user->settings()->sole()->update(['mail_deadline_reminders' => false]);

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertNothingSent();
});

test('sends nothing from an instance that has no mailer', function (): void {
    travelToUtc('2026-08-24 12:00:00');
    config()->set('mail.enabled', false);
    $user = User::factory()->create();

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    Notification::assertNothingSent();
    expect($user->settings()->sole()->deadline_reminders_mailed_on)->toBeNull();
});

test('is scheduled, so the scheduler container runs it', function (): void {
    $this->artisan('schedule:list')
        ->expectsOutputToContain('deadlines:send-reminders')
        ->assertSuccessful();
});
