<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Totp\TotpVerifier;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class VerifyTotpCode
{
    public function __construct(private readonly TotpVerifier $verifier) {}

    /**
     * Whether the code is the authenticator's current one; an accepted step is
     * recorded so the same code cannot answer twice.
     *
     * @param  non-empty-string  $code
     */
    public function handle(User $user, string $code): bool
    {
        return DB::transaction(function () use ($user, $code): bool {
            $locked = User::lockRow($user->id);
            $secret = $locked->totp_secret;

            if (! $locked->hasTotpEnabled() || $secret === null) {
                return false;
            }

            $step = $this->verifier->verify($secret, $code, $locked->totp_last_used_step);

            if ($step === null) {
                return false;
            }

            $locked->totp_last_used_step = $step;
            $locked->save();

            return true;
        });
    }
}
