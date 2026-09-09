<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class DeletePasskey
{
    /**
     * Removing the last second factor also drops what only existed for it:
     * the recovery codes and the trusted browsers.
     */
    public function handle(Passkey $passkey): void
    {
        DB::transaction(function () use ($passkey): void {
            $locked = User::lockRow($passkey->user_id);

            $passkey->delete();

            if (! $locked->hasTwoFactorEnabled()) {
                $locked->two_factor_recovery_codes = null;
                $locked->save();
                $locked->trustedDevices()->delete();
            }
        });
    }
}
