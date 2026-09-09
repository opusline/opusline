<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;

class RecognizeTrustedDevice
{
    /**
     * The live trusted-device row behind a presented token, for this user only:
     * a token issued to someone else never skips a challenge.
     */
    public function handle(User $user, ?string $token): ?TrustedDevice
    {
        if ($token === null || $token === '') {
            return null;
        }

        $device = $user->trustedDevices()
            ->where('token_hash', TrustedDevice::hashToken($token))
            ->where('expires_at', '>', now())
            ->first();

        if ($device === null) {
            return null;
        }

        $device->last_used_at = now();
        $device->save();

        return $device;
    }
}
