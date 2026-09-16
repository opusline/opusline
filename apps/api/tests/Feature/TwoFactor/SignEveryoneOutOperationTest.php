<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use TimoKoerber\LaravelOneTimeOperations\OneTimeOperation;

function signEveryoneOutOperation(): OneTimeOperation
{
    return require base_path('operations/2026_09_16_130203_sign_everyone_out_to_offer_trusted_browsers.php');
}

test('signs everyone out once and forgets every trusted browser', function (): void {
    $user = User::factory()->create(['remember_token' => 'kept-signed-in']);
    TrustedDevice::factory()->for($user)->create();
    DB::table('sessions')->insert([
        'id' => 'session-of-the-user',
        'user_id' => $user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Mozilla/5.0',
        'payload' => 'payload',
        'last_activity' => now()->getTimestamp(),
    ]);

    signEveryoneOutOperation()->process();

    expect($user->fresh()?->remember_token)->toBeNull()
        ->and(TrustedDevice::query()->count())->toBe(0)
        ->and(DB::table('sessions')->count())->toBe(0);
});

test('runs on boot rather than on a queue a self-hoster may not run', function (): void {
    expect(signEveryoneOutOperation()->isAsync())->toBeFalse();
});
