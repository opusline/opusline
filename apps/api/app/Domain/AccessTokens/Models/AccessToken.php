<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Models;

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * A personal access token: a bearer another application presents to read the
 * account's data, within the abilities it was created with.
 *
 * @property int $id
 * @property string $name
 * @property list<string> $abilities
 * @property ?CarbonImmutable $last_used_at
 * @property ?CarbonImmutable $expires_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Table('personal_access_tokens')]
class AccessToken extends PersonalAccessToken
{
    /** @return list<TokenAbility> */
    public function grantedAbilities(): array
    {
        return array_map(TokenAbility::from(...), $this->abilities);
    }

    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->tokens(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }
}
