<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Webauthn\PasskeyCeremony;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use ParagonIE\ConstantTime\Base64UrlSafe;

class StartPasskeyRegistration
{
    public function __construct(private readonly PasskeyCeremony $ceremony) {}

    /**
     * Mints the account's user handle on first use, then builds the creation
     * options; the caller keeps them for the verification step.
     *
     * @return array<string, mixed>
     */
    public function handle(User $user): array
    {
        $userHandle = DB::transaction(function () use ($user): string {
            $locked = User::lockRow($user->id);

            if ($locked->passkey_user_handle === null) {
                $locked->passkey_user_handle = Base64UrlSafe::encodeUnpadded(random_bytes(32));
                $locked->save();
            }

            return $locked->passkey_user_handle;
        });

        $registeredIds = $user->passkeys()->pluck('credential_id')->all();

        return $this->ceremony->creationOptions($user, $userHandle, array_values(array_filter($registeredIds, is_string(...))));
    }
}
