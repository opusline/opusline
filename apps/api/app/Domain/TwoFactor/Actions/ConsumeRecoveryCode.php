<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class ConsumeRecoveryCode
{
    /**
     * Whether the code was one of the account's unused recovery codes; a match
     * is spent on the spot, under the row lock so two challenges cannot share it.
     */
    public function handle(User $user, string $code): bool
    {
        return DB::transaction(function () use ($user, $code): bool {
            $locked = User::lockRow($user->id);
            $codes = $locked->two_factor_recovery_codes ?? [];

            foreach ($codes as $index => $candidate) {
                if (! hash_equals($candidate, $code)) {
                    continue;
                }

                unset($codes[$index]);

                $locked->two_factor_recovery_codes = array_values($codes);
                $locked->save();

                return true;
            }

            return false;
        });
    }
}
