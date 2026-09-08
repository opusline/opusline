<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\Users\Models\User;

class RevokeAllTrustedDevices
{
    public function handle(User $user): void
    {
        $user->trustedDevices()->delete();
    }
}
