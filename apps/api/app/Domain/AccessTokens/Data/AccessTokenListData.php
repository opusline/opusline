<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Data;

use Spatie\LaravelData\Data;

class AccessTokenListData extends Data
{
    /**
     * @param  list<AccessTokenData>  $tokens
     */
    public function __construct(
        public array $tokens,
    ) {}
}
