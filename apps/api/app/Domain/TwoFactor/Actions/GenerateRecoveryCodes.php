<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Recovery\RecoveryCodes;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\DB;

class GenerateRecoveryCodes
{
    /**
     * Replaces the whole set: a partially spent list is not topped up.
     *
     * @return list<string>
     */
    public function handle(User $user): array
    {
        return DB::transaction(function () use ($user): array {
            $locked = User::lockRow($user->id);

            abort_if(! $locked->hasTwoFactorEnabled(), 409, __('two-factor.not_enabled'));

            $codes = RecoveryCodes::mint();

            $locked->two_factor_recovery_codes = $codes;
            $locked->save();

            $locked->notify(SecurityAlert::duringRequest(SecurityAlertKind::RecoveryCodesRegenerated));

            return $codes;
        });
    }
}
