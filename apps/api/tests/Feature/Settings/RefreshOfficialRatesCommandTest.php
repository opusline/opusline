<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Http;

test('refreshes every account that follows the official barème', function (): void {
    Http::fake(['*/evaluate' => Http::response([
        'evaluate' => [
            ['nodeValue' => 25.6],
            ['nodeValue' => 220],
        ],
    ])]);

    $following = User::factory()->create();
    $following->settings()->sole()->update(['contribution_rate_bp' => 2460]);

    $manual = User::factory()->create();
    $manual->settings()->sole()->update(['auto_rates' => false, 'contribution_rate_bp' => 2000]);

    $this->artisan('rates:refresh')->assertSuccessful();

    expect($following->settings()->sole()->contribution_rate_bp)->toBe(2560)
        ->and($manual->settings()->sole()->contribution_rate_bp)->toBe(2000);
});

test('never applies the French barème to a business established abroad', function (): void {
    Http::fake(['*/evaluate' => Http::response([
        'evaluate' => [
            ['nodeValue' => 25.6],
            ['nodeValue' => 220],
        ],
    ])]);

    // Unreachable through UpdateSettings, which forces auto_rates off abroad —
    // but legacy rows and direct DB edits can hold this state.
    $abroad = User::factory()->create();
    $abroad->settings()->sole()->update([
        'business_country' => 'DE',
        'auto_rates' => true,
        'contribution_rate_bp' => 2000,
    ]);

    $this->artisan('rates:refresh')->assertSuccessful();

    expect($abroad->settings()->sole()->contribution_rate_bp)->toBe(2000);
});

test('leaves every stored rate alone when the barème is unreachable', function (): void {
    Http::fake(['*/evaluate' => Http::response(status: 503)]);

    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2460]);

    $this->artisan('rates:refresh')->assertFailed();

    expect($user->settings()->sole()->contribution_rate_bp)->toBe(2460);
});

test('is scheduled, so the compose service and the command cannot drift apart', function (): void {
    // Asserted through schedule:list rather than the container, because that is
    // what an operator reads to confirm the scheduler container has work to do.
    $this->artisan('schedule:list')
        ->expectsOutputToContain('rates:refresh')
        ->assertSuccessful();
});

test('stops probing a source that just refused, instead of paying the timeout per account', function (): void {
    Http::fake(['*/evaluate' => Http::response(status: 500)]);

    // Two accounts in different situations, so the rate cache cannot be what
    // spares the second call.
    User::factory()->create();
    $withAcre = User::factory()->create();
    $withAcre->settings()->sole()->update(['acre' => true, 'business_started_on' => now()->subMonth()]);

    $this->artisan('rates:refresh')->run();

    // One read, retried once — not one per account.
    Http::assertSentCount(2);
});
