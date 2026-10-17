<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Data;

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Domain\AccessTokens\Models\AccessToken;
use Spatie\LaravelData\Data;

class AccessTokenData extends Data
{
    /**
     * @param  list<TokenAbility>  $abilities
     */
    public function __construct(
        public int $id,
        public string $name,
        public array $abilities,
        public ?string $lastUsedAt,
        public string $createdAt,
    ) {}

    public static function fromModel(AccessToken $token): self
    {
        return new self(
            id: $token->id,
            name: $token->name,
            abilities: $token->grantedAbilities(),
            lastUsedAt: $token->last_used_at?->toIso8601String(),
            createdAt: $token->created_at->toIso8601String(),
        );
    }
}
