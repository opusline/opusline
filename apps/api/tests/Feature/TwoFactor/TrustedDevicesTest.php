<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use App\Http\TwoFactor\Support\TrustedDeviceCookie;
use Illuminate\Testing\TestResponse;

const CHROME_ON_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * Logs in through the challenge asking to trust the browser; returns the
 * challenge response carrying the trusted-device cookie.
 */
function loginTrustingBrowser(User $user, string $secret): TestResponse
{
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();

    $response = fromSpa()->withHeader('User-Agent', CHROME_ON_MAC)
        ->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret), 'trustDevice' => true])
        ->assertOk();

    fromSpa()->postJson('/api/logout')->assertNoContent();

    return $response;
}

test('trusting the browser sets a cookie and stores only a hash of its token', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);

    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));

    $device = $user->trustedDevices()->sole();

    expect($token)->toHaveLength(64)
        ->and($device->token_hash)->toBe(TrustedDevice::hashToken($token))
        ->and($device->user_agent)->toBe(CHROME_ON_MAC)
        ->and($device->expires_at->toDateString())->toBe(now()->addDays(TrustedDevice::LIFETIME_DAYS)->toDateString());
});

test('a trusted browser skips the challenge on its next login', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));

    $this->travel(2)->days();

    fromSpa()->withCookie(TrustedDeviceCookie::NAME, $token)
        ->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertOk();

    $this->assertAuthenticatedAs($user, 'web');
    expect($user->trustedDevices()->sole()->last_used_at?->toIso8601String())->toBe(now()->toIso8601String());
});

test('another account cannot ride on a trusted browser', function (): void {
    $owner = User::factory()->create();
    $secret = enableTotp($owner);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($owner, $secret));

    $other = User::factory()->create();
    enableTotp($other);

    fromSpa()->withCookie(TrustedDeviceCookie::NAME, $token)
        ->postJson('/api/login', ['email' => $other->email, 'password' => 'password'])
        ->assertAccepted();

    $this->assertGuest('web');
});

test('an expired trust no longer skips the challenge', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));

    $this->travel(TrustedDevice::LIFETIME_DAYS + 1)->days();

    fromSpa()->withCookie(TrustedDeviceCookie::NAME, $token)
        ->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertAccepted();
});

test('a tampered cookie no longer skips the challenge', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    TrustedDevice::factory()->for($user)->create();

    fromSpa()->withUnencryptedCookie(TrustedDeviceCookie::NAME, 'not-an-encrypted-token')
        ->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertAccepted();
});

test('the status lists the live trusted browsers and marks the current one', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));
    TrustedDevice::factory()->for($user)->expired()->create();
    $other = TrustedDevice::factory()->for($user)->create(['last_used_at' => now()->subDay()]);

    $response = fromSpa()->actingAs($user)
        ->withCookie(TrustedDeviceCookie::NAME, $token)
        ->getJson('/api/user/two-factor')
        ->assertOk();

    expect($response->json('trustedDevices'))->toHaveCount(2)
        ->and($response->json('trustedDevices.0'))->toMatchArray([
            'browser' => 'Chrome',
            'platform' => 'macOS',
            'current' => true,
        ])
        ->and($response->json('trustedDevices.1'))->toMatchArray([
            'id' => $other->id,
            'browser' => 'Firefox',
            'platform' => 'Linux',
            'current' => false,
        ]);
});

test('revoking a browser makes its cookie useless and drops it when it is the caller', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));
    $device = $user->trustedDevices()->sole();

    fromSpa()->actingAs($user)
        ->withCookie(TrustedDeviceCookie::NAME, $token)
        ->deleteJson("/api/user/trusted-devices/{$device->id}")
        ->assertNoContent()
        ->assertCookieExpired(TrustedDeviceCookie::NAME);

    fromSpa()->postJson('/api/logout')->assertNoContent();

    fromSpa()->withCookie(TrustedDeviceCookie::NAME, $token)
        ->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertAccepted();
});

test('revoking another browser keeps the caller\'s cookie', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));
    $other = TrustedDevice::factory()->for($user)->create();

    fromSpa()->actingAs($user)
        ->withCookie(TrustedDeviceCookie::NAME, $token)
        ->deleteJson("/api/user/trusted-devices/{$other->id}")
        ->assertNoContent()
        ->assertCookieMissing(TrustedDeviceCookie::NAME);

    expect($user->trustedDevices()->count())->toBe(1);
});

test('a browser trusted by another account cannot be revoked through this one', function (): void {
    $user = User::factory()->create();
    $foreign = TrustedDevice::factory()->create();

    fromSpa()->actingAs($user)->deleteJson("/api/user/trusted-devices/{$foreign->id}")->assertNotFound();

    expect(TrustedDevice::query()->whereKey($foreign->id)->exists())->toBeTrue();
});

test('revoking every browser clears the list and the caller\'s cookie', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $token = trustedDeviceTokenFrom(loginTrustingBrowser($user, $secret));
    TrustedDevice::factory()->for($user)->count(2)->create();

    fromSpa()->actingAs($user)
        ->withCookie(TrustedDeviceCookie::NAME, $token)
        ->deleteJson('/api/user/trusted-devices')
        ->assertNoContent()
        ->assertCookieExpired(TrustedDeviceCookie::NAME);

    expect($user->trustedDevices()->count())->toBe(0);
});

test('disabling the authenticator revokes every trusted browser', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    TrustedDevice::factory()->for($user)->count(2)->create();

    withConfirmedPassword($user)->deleteJson('/api/user/two-factor/totp')->assertNoContent();

    expect($user->trustedDevices()->count())->toBe(0);
});

test('expired trusted browsers are pruned', function (): void {
    $user = User::factory()->create();
    TrustedDevice::factory()->for($user)->expired()->create();
    $live = TrustedDevice::factory()->for($user)->create();

    $this->artisan('model:prune', ['--model' => [TrustedDevice::class]])->assertSuccessful();

    expect($user->trustedDevices()->pluck('id')->all())->toBe([$live->id]);
});
