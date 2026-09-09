<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Str;

class IssueTrustedDevice
{
    /**
     * Records the browser and returns the clear token, which exists only in
     * the cookie about to be set.
     */
    public function handle(User $user, ?string $userAgent, ?string $ip): string
    {
        $token = Str::random(64);

        $user->trustedDevices()->create([
            'token_hash' => TrustedDevice::hashToken($token),
            'user_agent' => $userAgent === null ? null : Str::limit($userAgent, 512, ''),
            'ip' => $ip,
            'last_used_at' => now(),
            'expires_at' => now()->addDays(TrustedDevice::LIFETIME_DAYS),
        ]);

        return $token;
    }
}
