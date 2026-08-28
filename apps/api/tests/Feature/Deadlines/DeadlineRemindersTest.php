<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Users\Models\User;

/** What the badge counts: the reminders the account has not looked at yet. */
function unreadReminderCount(User $user): int
{
    $reminders = test()->actingAs($user)->getJson('/api/deadlines')->json('reminders');

    return count(array_filter($reminders, static fn (array $reminder): bool => ! $reminder['isRead']));
}

beforeEach(fn () => freezeTodayAtUtcNoon());

test('speaks up about what is late and about what is a week out', function (): void {
    $user = User::factory()->create();

    $reminders = $this->actingAs($user)->getJson('/api/deadlines')->assertOk()->json('reminders');

    expect(array_column(array_column($reminders, 'deadline'), 'dueOn'))->toBe([
        // Two URSSAF months already past; nothing else is close enough yet.
        '2026-06-30',
        '2026-07-31',
    ]);
});

test('stays quiet about a deadline still further out than the first lead', function (): void {
    $user = User::factory()->create();

    // July's URSSAF falls on 31 August: still eighteen days away.
    expect(collect($this->actingAs($user)->getJson('/api/deadlines')->json('reminders'))
        ->pluck('deadline.dueOn'))
        ->not->toContain('2026-08-31');
});

test('counts every reminder as unread until the user looks', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('reminders.0.isRead', false);

    expect(unreadReminderCount($user))->toBe(2);
});

test('marking them read clears the badge', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/deadlines/reminders/read')
        ->assertOk()
        ->assertJsonPath('reminders.0.isRead', true);

    // A fresh instance, so this reads the watermark back from the database
    // rather than the settings the write request left in memory.
    expect(unreadReminderCount($user->fresh()))->toBe(0);
});

test('a lead reached after the last look turns unread again', function (): void {
    $user = User::factory()->create();

    // Someone who last looked on 29 July. Not fillable on purpose —
    // MarkDeadlineRemindersRead is the only writer of the watermark.
    $user->settings()->sole()->forceFill(['deadline_reminders_read_at' => '2026-07-29'])->save();

    // June's URSSAF last spoke up on its due date, before that look; July's
    // crossed its day-before lead on the 30th, after it.
    $this->actingAs($user->fresh())
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('reminders.0.isRead', true)
        ->assertJsonPath('reminders.1.isRead', false)
        ->assertJsonPath('reminders.1.deadline.dueOn', '2026-07-31');

    expect(unreadReminderCount($user->fresh()))->toBe(1);
});

test('a calendar rewritten by a settings change comes back unread', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/deadlines/reminders/read')->assertOk();

    // Switching the periodicity rewrites every URSSAF occurrence; a moved
    // deadline already past its lead would otherwise sit behind the watermark.
    $this->actingAs($user->fresh())
        ->putJson('/api/settings', settingsPayload([
            'urssafPeriodicity' => UrssafPeriodicity::Quarterly->value,
        ]))
        ->assertOk();

    expect($user->fresh()->settingsOrFail()->deadline_reminders_read_at)->toBeNull()
        ->and(unreadReminderCount($user->fresh()))->toBeGreaterThan(0);
});

test('an amount that moves no date leaves the badge alone', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/deadlines/reminders/read')->assertOk();

    // The December CFE row already existed without a figure; giving it one
    // changes what it says, not when it falls — nothing new to announce.
    $this->actingAs($user->fresh())
        ->putJson('/api/settings', settingsPayload([
            'cfeExpected' => ['amount' => 48_000, 'currency' => 'EUR'],
        ]))
        ->assertOk();

    expect(unreadReminderCount($user->fresh()))->toBe(0);
});

test('a settings save that leaves the calendar alone keeps the badge clear', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/deadlines/reminders/read')->assertOk();

    $this->actingAs($user->fresh())
        ->putJson('/api/settings', settingsPayload(['tradeName' => 'Vesterhus Studio']))
        ->assertOk();

    expect(unreadReminderCount($user->fresh()))->toBe(0);
});

test('a deadline ticked off stops reminding', function (): void {
    $user = User::factory()->create();

    // Written directly: this is about the reminder rule, not about the endpoint
    // that records a tick — that one has its own test.
    FiscalDeadlineCompletion::factory()
        ->for($user)
        ->of(FiscalDeadlineKind::UrssafDeclaration, '2026-05')
        ->dueOn('2026-06-30')
        ->create();

    expect(collect($this->actingAs($user)->getJson('/api/deadlines')->json('reminders'))
        ->pluck('deadline.dueOn'))
        ->not->toContain('2026-06-30');
});
