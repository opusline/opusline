<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Totp\TotpSecret;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class StartTotpSetup
{
    /**
     * Stores a fresh, unconfirmed secret and hands it back in clear for the
     * one moment it is shown to the user.
     */
    public function handle(User $user): string
    {
        $secret = TotpSecret::mint();

        DB::transaction(function () use ($user, $secret): void {
            $locked = User::lockRow($user->id);

            abort_if($locked->hasTotpEnabled(), 409, __('two-factor.already_enabled'));

            $locked->totp_secret = $secret;
            $locked->totp_last_used_step = null;
            $locked->save();
        });

        return $secret;
    }
}
