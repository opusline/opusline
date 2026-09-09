<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class DisableTotp
{
    /**
     * Also cancels a setup that was started but never confirmed. When no
     * second factor is left, the recovery codes and the trusted browsers go
     * with it: they only ever existed for the challenge.
     */
    public function handle(User $user): void
    {
        DB::transaction(function () use ($user): void {
            $locked = User::lockRow($user->id);

            $locked->totp_secret = null;
            $locked->totp_confirmed_at = null;
            $locked->totp_last_used_step = null;

            if (! $locked->hasTwoFactorEnabled()) {
                $locked->two_factor_recovery_codes = null;
                $locked->trustedDevices()->delete();
            }

            $locked->save();
        });
    }
}
