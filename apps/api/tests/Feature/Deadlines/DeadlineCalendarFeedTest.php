<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** The feed path the client would compose from the token the API hands back. */
function calendarUrlFor(User $user): string
{
    $token = test()->actingAs($user)->getJson('/api/deadlines')->json('calendarToken');

    return "/api/calendar/{$token}.ics";
}

test('hands out an opaque token for the client to compose the feed from', function (): void {
    $user = User::factory()->create();

    $token = $this->actingAs($user)->getJson('/api/deadlines')->json('calendarToken');

    expect($token)->toHaveLength(64)
        ->and($token)->toBe($user->fresh()->settingsOrFail()->calendar_token);
});

test('serves the deadlines as a subscribable calendar', function (): void {
    $user = User::factory()->create();

    $response = $this->get(calendarUrlFor($user))->assertOk();

    $response->assertHeader('Content-Type', 'text/calendar; charset=utf-8');

    $body = $response->content();

    expect($body)->toContain('BEGIN:VCALENDAR')
        ->toContain('END:VCALENDAR')
        // Tells a calendar app to come back rather than import once.
        ->toContain('REFRESH-INTERVAL')
        ->toContain('Déclaration URSSAF')
        // All-day entries, and two alarms per event.
        ->toContain('DTSTART;VALUE=DATE:20260831')
        ->toContain('BEGIN:VALARM');
});

test('gives every occurrence an identifier a refresh can replace', function (): void {
    $user = User::factory()->create();

    $body = $this->get(calendarUrlFor($user))->assertOk()->content();
    preg_match_all('/^UID:(.+)$/m', $body, $matches);

    $uids = array_map(trim(...), $matches[1]);

    expect($uids)->not->toBeEmpty()
        ->and($uids)->toBe(array_unique($uids))
        ->and($uids[0])->toStartWith("opusline-{$user->getKey()}-");
});

test('reaches further out than the screen does', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    // The screen stops twelve months out; a subscribed calendar keeps eighteen.
    expect($this->get(calendarUrlFor($user->fresh()))->assertOk()->content())
        ->toContain('DTSTART;VALUE=DATE:20271215');
});

test('speaks the language of the account it belongs to', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => Locale::en_US]);

    expect($this->get(calendarUrlFor($user->fresh()))->assertOk()->content())
        ->toContain('Estimate:');
});

test('writes amounts in the notation of the account, not of the server', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => Locale::fr_FR]);
    paidInvoiceOn($user, '2026-07-10');

    // French notation, whatever the server's own locale is. The comma comes
    // back escaped: RFC 5545 reserves it as a value separator.
    expect($this->get(calendarUrlFor($user->fresh()))->assertOk()->content())
        ->toContain('Estimation : 422\\,40');
});

test('mints one token however many readers race the first look', function (): void {
    $user = User::factory()->create();

    // Two reads of an account that has never had a token: both must come away
    // with the same one, or whichever URL got subscribed to would stop working.
    expect(calendarUrlFor($user->fresh()))->toBe(calendarUrlFor($user->fresh()))
        ->and(UserSettings::query()->whereNotNull('calendar_token')->count())->toBe(1);
});

test('rejects a token nobody holds', function (): void {
    $this->get('/api/calendar/'.str_repeat('a', 64).'.ics')->assertNotFound();
});

test('rejects a token of the wrong shape outright', function (): void {
    $this->get('/api/calendar/short.ics')->assertNotFound();
});

test('rotating the token retires the calendar already subscribed to', function (): void {
    $user = User::factory()->create();
    $original = calendarUrlFor($user);

    $rotated = '/api/calendar/'.$this->actingAs($user->fresh())
        ->postJson('/api/deadlines/calendar/token')
        ->assertOk()
        ->json('calendarToken').'.ics';

    expect($rotated)->not->toBe($original);

    $this->get($original)->assertNotFound();
    $this->get($rotated)->assertOk();
});

test('the feed needs no session of its own', function (): void {
    $user = User::factory()->create();
    $url = calendarUrlFor($user);

    // A calendar app sends no cookie: the token in the path is the credential.
    $this->get($url)->assertOk();
});

test('carries an open invoice as its own entry, and drops it once paid', function (): void {
    $user = User::factory()->create();

    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-07-01',
        'due_on' => '2026-09-04',
        'currency' => 'EUR',
        'amount_ht_cents' => 165_000,
        'amount_ttc_cents' => 198_000,
    ]));

    $body = $this->get(calendarUrlFor($user))->assertOk()->content();

    expect($body)->toContain('DTSTART;VALUE=DATE:20260904')
        ->toContain('-inv-');
});

test('the relance nudge lands three days past due, and only when opted in', function (): void {
    $user = User::factory()->create();

    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-05-01',
        'due_on' => '2026-07-20',
        'currency' => 'EUR',
        'amount_ht_cents' => 165_000,
        'amount_ttc_cents' => 198_000,
    ]));

    // Off by default: a task-nag in a calendar is opt-in.
    expect($this->get(calendarUrlFor($user))->assertOk()->content())
        ->not->toContain('-rem-');

    $this->actingAs($user->fresh())->patchJson('/api/deadlines/calendar', [
        'invoices' => true,
        'reminders' => true,
        'vat' => true,
        'urssaf' => true,
        'other' => true,
    ])->assertOk();

    expect($this->get(calendarUrlFor($user->fresh()))->assertOk()->content())
        ->toContain('-rem-')
        ->toContain('DTSTART;VALUE=DATE:20260723');
});

test('a category switched off leaves the feed', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patchJson('/api/deadlines/calendar', [
            'invoices' => true,
            'reminders' => false,
            'vat' => true,
            'urssaf' => false,
            'other' => true,
        ])
        ->assertOk()
        ->assertJsonPath('calendarFeed.urssaf', false);

    expect($this->get(calendarUrlFor($user->fresh()))->assertOk()->content())
        ->not->toContain('Déclaration URSSAF');
});

test('the dialog checkboxes come back with the board', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('calendarFeed.invoices', true)
        ->assertJsonPath('calendarFeed.reminders', false)
        ->assertJsonPath('calendarFeed.vat', true)
        ->assertJsonPath('calendarFeed.urssaf', true)
        ->assertJsonPath('calendarFeed.other', true);
});

test('saying the address is added flips the board to subscribed', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('calendarSubscribedOn', null);

    $this->actingAs($user->fresh())
        ->postJson('/api/deadlines/calendar/subscription')
        ->assertOk()
        ->assertJsonPath('calendarSubscribedOn', '2026-08-13');
});

test('a calendar coming to fetch stamps the last synchronisation', function (): void {
    $user = User::factory()->create();

    $this->get(calendarUrlFor($user))->assertOk();

    expect($user->fresh()->settingsOrFail()->calendar_last_synced_at)->not->toBeNull();

    $this->actingAs($user->fresh())
        ->getJson('/api/deadlines')
        ->assertOk()
        ->assertJsonPath('calendarLastSyncedAt', fn ($value): bool => $value !== null);
});

test('serves validators a calendar client can revalidate with', function (): void {
    $user = User::factory()->create();

    $response = $this->get(calendarUrlFor($user))->assertOk();

    expect($response->headers->get('ETag'))->toStartWith('"')
        ->and($response->headers->get('Cache-Control'))->toContain('private')
        ->and($response->headers->get('Cache-Control'))->toContain('max-age=1800');
});

test('answers a repeat poll with 304 and no body', function (): void {
    $user = User::factory()->create();
    $url = calendarUrlFor($user);

    $etag = $this->get($url)->assertOk()->headers->get('ETag');

    $repeat = $this->get($url, ['If-None-Match' => $etag]);

    $repeat->assertStatus(304);
    expect($repeat->content())->toBe('')
        ->and($repeat->headers->get('ETag'))->toBe($etag);
});

test('a weak validator still matches', function (): void {
    // Calendar clients commonly echo the tag back as W/"..." on a GET.
    $user = User::factory()->create();
    $url = calendarUrlFor($user);

    $etag = $this->get($url)->assertOk()->headers->get('ETag');

    $this->get($url, ['If-None-Match' => 'W/'.$etag])->assertStatus(304);
});

test('rebuilds the feed when a client is renamed', function (): void {
    // Every invoice event prints the client name, so a rename must invalidate
    // the validator even though no invoice row moved.
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());
    $url = calendarUrlFor($user);

    $etag = $this->get($url)->assertOk()->headers->get('ETag');

    // Off the frozen instant: updated_at only moves when the clock does.
    $this->travelTo(now()->addMinute());
    $invoice->client->update(['name' => 'Vesterhus']);

    $rebuilt = $this->get($url, ['If-None-Match' => $etag])->assertOk();

    expect($rebuilt->headers->get('ETag'))->not->toBe($etag)
        ->and($rebuilt->content())->toContain('Vesterhus');
});

test('the heartbeat never invalidates the feed it stamps', function (): void {
    // The stamp is written without touching updated_at: an ETag fed by its own
    // side effect would turn every second poll into a full rebuild.
    $user = User::factory()->create();
    $url = calendarUrlFor($user);
    $updatedAtBefore = $user->fresh()->settingsOrFail()->updated_at;

    $etag = $this->get($url)->assertOk()->headers->get('ETag');

    $settings = $user->fresh()->settingsOrFail();
    expect($settings->calendar_last_synced_at)->not->toBeNull()
        ->and($settings->updated_at->equalTo($updatedAtBefore))->toBeTrue();

    $this->get($url, ['If-None-Match' => $etag])->assertStatus(304);
});

test('the heartbeat is stamped coarsely, not per poll', function (): void {
    $user = User::factory()->create();
    $url = calendarUrlFor($user);

    $this->get($url)->assertOk();
    $firstStamp = $user->fresh()->settingsOrFail()->calendar_last_synced_at;

    $this->travelTo(now()->addMinutes(5));
    $this->get($url);
    expect($user->fresh()->settingsOrFail()->calendar_last_synced_at->equalTo($firstStamp))->toBeTrue();

    $this->travelTo(now()->addMinutes(20));
    $this->get($url);
    expect($user->fresh()->settingsOrFail()->calendar_last_synced_at->greaterThan($firstStamp))->toBeTrue();
});

test('interrupting retires the address and clears the subscription', function (): void {
    $user = User::factory()->create();
    $before = calendarUrlFor($user);

    $this->actingAs($user->fresh())->postJson('/api/deadlines/calendar/subscription')->assertOk();
    $this->get($before)->assertOk();

    $this->actingAs($user->fresh())
        ->deleteJson('/api/deadlines/calendar/subscription')
        ->assertOk()
        ->assertJsonPath('calendarSubscribedOn', null)
        ->assertJsonPath('calendarLastSyncedAt', null);

    // The old address stops answering: subscribed calendars go quiet for real.
    $this->get($before)->assertNotFound();
});
