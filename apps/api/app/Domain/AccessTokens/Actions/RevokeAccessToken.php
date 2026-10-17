<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Actions;

use App\Domain\AccessTokens\Models\AccessToken;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;

class RevokeAccessToken
{
    public function handle(User $user, AccessToken $token): void
    {
        $token->delete();

        $user->notify(SecurityAlert::duringRequest(SecurityAlertKind::AccessTokenRevoked));
    }
}
