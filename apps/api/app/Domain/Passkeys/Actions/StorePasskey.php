<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Passkeys\Webauthn\PasskeyCeremony;
use App\Domain\Passkeys\Webauthn\PasskeyVerificationFailed;
use App\Domain\TwoFactor\Recovery\RecoveryCodes;
use App\Domain\Users\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StorePasskey
{
    public function __construct(private readonly PasskeyCeremony $ceremony) {}

    /**
     * Verifies the browser's answer to the creation options and stores the
     * credential. The first second factor on the account also mints its
     * recovery codes.
     *
     * @param  array<string, mixed>  $credential
     * @param  array<string, mixed>  $options
     *
     * @throws ValidationException
     */
    public function handle(User $user, string $name, array $credential, array $options): Passkey
    {
        try {
            $verified = $this->ceremony->verifyRegistration($credential, $options);
        } catch (PasskeyVerificationFailed) {
            throw ValidationException::withMessages(['credential' => __('passkeys.verification_failed')]);
        }

        if (Passkey::query()->where('credential_id', $verified->credentialId)->exists()) {
            throw ValidationException::withMessages(['credential' => __('passkeys.already_registered')]);
        }

        return DB::transaction(function () use ($user, $name, $verified): Passkey {
            $locked = User::lockRow($user->id);

            try {
                $passkey = $locked->passkeys()->create([
                    'name' => $name,
                    'credential_id' => $verified->credentialId,
                    'public_key' => $verified->publicKey,
                    'counter' => $verified->counter,
                    'transports' => $verified->transports,
                    'aaguid' => $verified->aaguid,
                    'backup_eligible' => $verified->backupEligible,
                    'backed_up' => $verified->backedUp,
                ]);
            } catch (UniqueConstraintViolationException) {
                // The pre-check only saw this account's rows; the credential_id
                // index is the guard against two accounts racing the same key.
                throw ValidationException::withMessages(['credential' => __('passkeys.already_registered')]);
            }

            if ($locked->two_factor_recovery_codes === null) {
                $locked->two_factor_recovery_codes = RecoveryCodes::mint();
                $locked->save();
            }

            return $passkey;
        });
    }
}
