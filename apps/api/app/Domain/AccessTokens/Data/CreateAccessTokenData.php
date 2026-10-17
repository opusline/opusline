<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Data;

use App\Domain\AccessTokens\Enums\TokenAbility;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class CreateAccessTokenData extends Data
{
    /**
     * @param  list<string>  $abilities  What the token may do, as TokenAbility values; at least one.
     */
    public function __construct(
        #[Min(1), Max(100)]
        public string $name,
        public array $abilities,
    ) {}

    /** @return list<TokenAbility> */
    public function grantedAbilities(): array
    {
        return array_map(TokenAbility::from(...), $this->abilities);
    }

    /**
     * The item rule is spelled out because a rules() entry replaces every rule
     * for its property, and the enum check has to reach each ability.
     *
     * @return array<string, list<string|Enum>>
     */
    public static function rules(): array
    {
        return [
            'abilities' => ['required', 'array', 'min:1'],
            'abilities.*' => ['required', 'string', 'distinct', Rule::enum(TokenAbility::class)],
        ];
    }
}
