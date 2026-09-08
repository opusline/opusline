<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Webauthn\PasskeyCeremony;
use App\Domain\Users\Models\User;

class StartPasskeyAssertion
{
    public function __construct(private readonly PasskeyCeremony $ceremony) {}

    /**
     * Options for the second-factor step: the password already named the
     * account, so only its own passkeys are offered.
     *
     * @return array<string, mixed>
     */
    public function handle(User $user): array
    {
        $ids = $user->passkeys()->pluck('credential_id')->all();

        return $this->ceremony->requestOptions(
            array_values(array_filter($ids, is_string(...))),
            requireUserVerification: false,
        );
    }
}
