<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Passkeys\Webauthn\CredentialJson;
use App\Domain\Passkeys\Webauthn\PasskeyCeremony;
use App\Domain\Passkeys\Webauthn\PasskeyVerificationFailed;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VerifyPasskeyAssertion
{
    public function __construct(private readonly PasskeyCeremony $ceremony) {}

    /**
     * The passkey the assertion proves possession of, among the candidates,
     * or null. A verified assertion records the authenticator's counter and
     * the use.
     *
     * @param  array<string, mixed>  $credential
     * @param  array<string, mixed>  $options
     * @param  iterable<Passkey>  $candidates
     */
    public function handle(array $credential, array $options, iterable $candidates): ?Passkey
    {
        $credentialId = CredentialJson::id($credential);

        if ($credentialId === null) {
            return null;
        }

        foreach ($candidates as $passkey) {
            if (! hash_equals($passkey->credential_id, $credentialId)) {
                continue;
            }

            $userHandle = $passkey->user->passkey_user_handle;

            if ($userHandle === null) {
                return null;
            }

            try {
                $counter = $this->ceremony->verifyAssertion($credential, $options, $passkey, $userHandle);
            } catch (PasskeyVerificationFailed $exception) {
                // The library's reason is the only thing that tells a
                // misconfigured PASSKEYS_ORIGINS — where every sign-in fails
                // identically — from a genuine refusal. The credential itself
                // never goes to the log.
                Log::warning('Passkey assertion refused.', [
                    'user_id' => $passkey->user_id,
                    'passkey_id' => $passkey->id,
                    'ip' => request()->ip(),
                    'reason' => $exception->getMessage(),
                ]);

                return null;
            }

            return DB::transaction(function () use ($passkey, $counter): Passkey {
                $passkey->counter = $counter;
                $passkey->last_used_at = now();
                $passkey->save();

                return $passkey;
            });
        }

        return null;
    }
}
