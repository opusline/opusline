<?php

declare(strict_types=1);

use App\Domain\Settings\Rates\RateSituation;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Sleep;
use Illuminate\Testing\TestResponse;

test('applies the official barème', function (): void {
    fakeBareme();
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2460]);

    $this->actingAs($user)
        ->postJson('/api/settings/rates/refresh')
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 2560)
        ->assertJsonPath('liberatingPaymentRateBp', 220)
        ->assertJsonPath('ratesYear', now()->year);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'contribution_rate_bp' => 2560,
    ]);
});

test('records when the barème was last read', function (): void {
    fakeBareme();
    $user = User::factory()->create();

    expect($user->settings()->sole()->rates_checked_at)->toBeNull();

    $this->actingAs($user)->postJson('/api/settings/rates/refresh')->assertOk();

    expect($user->settings()->sole()->rates_checked_at)->not->toBeNull();
});

test('derives the versement libératoire rate from the probe amount', function (): void {
    // 330 € on a 10 000 € probe is 3,30 % — the rate is measured, not assumed.
    fakeBareme(liberatingAmount: 330);

    $this->actingAs(User::factory()->create())
        ->postJson('/api/settings/rates/refresh')
        ->assertOk()
        ->assertJsonPath('liberatingPaymentRateBp', 330);
});

test('applies the reduced rate for an account under ACRE', function (): void {
    fakeBareme(ratePercent: 12.8);
    $user = User::factory()->create();
    $user->settings()->sole()->update(['acre' => true, 'business_started_on' => now()->subMonths(2)]);

    $this->actingAs($user)
        ->postJson('/api/settings/rates/refresh')
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 1280);
});

test('keeps the stored rates when the barème cannot be read', function (): void {
    Http::fake(['*/evaluate' => Http::response(status: 500)]);
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2460]);

    $this->actingAs($user)
        ->postJson('/api/settings/rates/refresh')
        ->assertStatus(503);

    expect($user->settings()->sole()->contribution_rate_bp)->toBe(2460);
});

test('keeps the stored rates when the source returns no usable value', function (): void {
    Http::fake(['*/evaluate' => Http::response(['evaluate' => [['nodeValue' => null]]])]);
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2460]);

    $this->actingAs($user)->postJson('/api/settings/rates/refresh')->assertStatus(503);

    expect($user->settings()->sole()->contribution_rate_bp)->toBe(2460);
});

test('refuses when the account follows its own rate', function (): void {
    fakeBareme();
    $user = User::factory()->create();
    $user->settings()->sole()->update(['auto_rates' => false, 'contribution_rate_bp' => 2000]);

    $this->actingAs($user)
        ->postJson('/api/settings/rates/refresh')
        ->assertStatus(409);

    expect($user->settings()->sole()->contribution_rate_bp)->toBe(2000);
});

test('re-reads the barème for an explicit check rather than repeating a cached one', function (): void {
    // « Vérifier maintenant » promises the user a check; answering it from a
    // cache filled by the nightly run would report a verification that never
    // reached URSSAF.
    fakeBareme();

    $this->actingAs(User::factory()->create())->postJson('/api/settings/rates/refresh')->assertOk();
    $this->actingAs(User::factory()->create())->postJson('/api/settings/rates/refresh')->assertOk();

    Http::assertSentCount(2);
});

test('reports when the barème was actually read, not when the cache was consulted', function (): void {
    fakeBareme();
    $readAt = now()->subHours(6);

    $this->travelTo($readAt);
    $this->actingAs(User::factory()->create())->postJson('/api/settings/rates/refresh')->assertOk();
    $this->travelBack();

    // A save re-reads through the cache; the stamp must stay at the real read.
    $later = User::factory()->create();
    $later->settings()->sole()->update(['auto_rates' => false]);
    $this->actingAs($later)
        ->putJson('/api/settings', settingsPayload(['autoRates' => true]))
        ->assertOk()
        ->assertJsonPath('ratesCheckedAt', $readAt->toIso8601String());
});

test('never touches another account', function (): void {
    fakeBareme();
    $other = User::factory()->create();
    $other->settings()->sole()->update(['contribution_rate_bp' => 2000, 'auto_rates' => false]);

    $this->actingAs(User::factory()->create())->postJson('/api/settings/rates/refresh')->assertOk();

    expect($other->settings()->sole()->contribution_rate_bp)->toBe(2000);
});

test('returns 401 for guests', function (): void {
    $this->postJson('/api/settings/rates/refresh')->assertUnauthorized();
});

test('does not call out when the source is disabled', function (): void {
    Http::fake();
    config()->set('services.mon_entreprise.enabled', false);

    $this->actingAs(User::factory()->create())
        ->postJson('/api/settings/rates/refresh')
        ->assertStatus(503);

    Http::assertNothingSent();
});

test('caches the barème as plain values, so a serialized cache cannot poison it', function (): void {
    // Storing the value object instead returns __PHP_Incomplete_Class from Redis
    // when the class is not yet loaded, and every rate then reads as null.
    fakeBareme();

    $this->actingAs(User::factory()->create())
        ->postJson('/api/settings/rates/refresh')
        ->assertOk();

    $cached = collect(Cache::get(
        'official-rates:'.new RateSituation(false, null)->signature(),
    ));

    expect($cached->except('readAt')->all())->toBe([
        'contributionRateBp' => 2560,
        'liberatingPaymentRateBp' => 220,
        'year' => now()->year,
    ]);
    expect($cached->get('readAt'))->toBeString();
});

test('lets an explicit check retry a source that just refused', function (): void {
    // « Vérifier maintenant » is the user saying "try again now", so it clears
    // the short-lived unavailable marker rather than answering from it.
    Sleep::fake();
    Http::fake(['*/evaluate' => Http::response(status: 500)]);
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/settings/rates/refresh')->assertStatus(503);
    $this->actingAs($user)->postJson('/api/settings/rates/refresh')->assertStatus(503);

    // Two reads, each retried once by the client.
    Http::assertSentCount(4);
});

test('a settings save pays the timeout once, never twice', function (): void {
    // The user pressed Enregistrer, not « Vérifier maintenant »: retrying a
    // refusing source here doubles the wait on a request that was about saving
    // settings, and the save already degrades to keeping the stored rates.
    Sleep::fake();
    Http::fake(['*/evaluate' => Http::response(status: 500)]);

    adoptOfficialRates(User::factory()->create())->assertOk();

    Http::assertSentCount(1);
});

test('still serves a barème held in cache while the source is refusing', function (): void {
    // The marker exists to stop doomed calls, not to withhold a barème that was
    // read successfully minutes ago for a situation nobody has failed on.
    Sleep::fake();
    Http::fake(fn (Request $request) => $request->data()['situation']['dirigeant . exonérations . ACRE'] === 'oui'
        ? Http::response(status: 500)
        : Http::response(['evaluate' => [['nodeValue' => 25.6], ['nodeValue' => 220]]]));

    adoptOfficialRates(User::factory()->create())
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 2560);

    adoptOfficialRates(User::factory()->create(), [
        'acre' => true,
        'businessStartedOn' => now()->subMonths(2)->format('Y-m-d'),
    ])->assertOk()->assertJsonPath('ratesCheckedAt', null);

    adoptOfficialRates(User::factory()->create())
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 2560)
        ->assertJsonPath('ratesYear', now()->year);
});

/**
 * Switch an account from its own rate to the official source, which is what
 * makes a save re-read the barème.
 *
 * @param  array<string, mixed>  $overrides
 */
function adoptOfficialRates(User $user, array $overrides = []): TestResponse
{
    $user->settings()->sole()->update(['auto_rates' => false]);

    return test()->actingAs($user)->putJson(
        '/api/settings',
        settingsPayload(['autoRates' => true, ...$overrides]),
    );
}
