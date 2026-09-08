<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Recovery\RecoveryCodes;
use App\Domain\TwoFactor\Totp\TotpVerifier;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ConfirmTotp
{
    public function __construct(private readonly TotpVerifier $verifier) {}

    /**
     * Enables the authenticator and returns the freshly minted recovery codes.
     *
     * @param  non-empty-string  $code
     * @return list<string>
     */
    public function handle(User $user, string $code): array
    {
        return DB::transaction(function () use ($user, $code): array {
            $locked = User::lockRow($user->id);

            abort_if($locked->hasTotpEnabled(), 409, __('two-factor.already_enabled'));

            $secret = $locked->totp_secret;

            abort_if($secret === null, 409, __('two-factor.setup_not_started'));

            $step = $this->verifier->verify($secret, $code, $locked->totp_last_used_step);

            if ($step === null) {
                throw ValidationException::withMessages(['code' => __('two-factor.invalid_code')]);
            }

            $codes = RecoveryCodes::mint();

            $locked->totp_confirmed_at = now();
            $locked->totp_last_used_step = $step;
            $locked->two_factor_recovery_codes = $codes;
            $locked->save();

            return $codes;
        });
    }
}
