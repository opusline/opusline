<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Actions;

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\NewAccessToken;

class CreateAccessToken
{
    /**
     * @param  list<TokenAbility>  $abilities
     */
    public function handle(User $user, string $name, array $abilities): NewAccessToken
    {
        $token = $user->createToken(
            $name,
            array_map(fn (TokenAbility $ability): string => $ability->value, $abilities),
        );

        // A token is a standing way into the account's data; if it was not the
        // owner who minted it, this line is how they find out when.
        Log::warning('Access token created.', [
            'user_id' => $user->id,
            'token_id' => $token->accessToken->getKey(),
            'ip' => request()->ip(),
        ]);
        $user->notify(SecurityAlert::duringRequest(SecurityAlertKind::AccessTokenCreated));

        return $token;
    }
}
