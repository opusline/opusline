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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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
        } catch (PasskeyVerificationFailed $exception) {
            // Enrolment fails the same way for a bad relying-party
            // configuration as for a bad credential; the reason is what tells
            // the operator which of the two they are looking at.
            Log::warning('Passkey registration refused.', [
                'user_id' => $user->id,
                'ip' => request()->ip(),
                'reason' => $exception->getMessage(),
            ]);

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
                // The pre-check runs outside the lock; the credential_id index
                // is the guard against two registrations racing the same key.
                throw ValidationException::withMessages(['credential' => __('passkeys.already_registered')]);
            }

            if ($locked->two_factor_recovery_codes === null) {
                // See ConfirmTotp: the first second factor voids remember-me.
                $locked->two_factor_recovery_codes = RecoveryCodes::mint();
                $locked->setRememberToken(Str::random(60));
                $locked->save();
            }

            // A new passkey is a new way into the account; if it was not the
            // owner who added it, this line is how they find out when.
            Log::warning('Passkey registered.', [
                'user_id' => $user->id,
                'passkey_id' => $passkey->id,
                'ip' => request()->ip(),
            ]);

            return $passkey;
        });
    }
}
