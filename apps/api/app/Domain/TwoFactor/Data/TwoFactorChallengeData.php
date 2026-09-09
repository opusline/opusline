<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use App\Domain\TwoFactor\Enums\TwoFactorMethod;
use Spatie\LaravelData\Data;

/**
 * The 202 answer to a correct password on an account with a second factor:
 * the caller is not signed in yet and has to answer the challenge.
 */
class TwoFactorChallengeData extends Data
{
    /**
     * @param  list<TwoFactorMethod>  $methods
     */
    public function __construct(
        public array $methods,
        public bool $twoFactorRequired = true,
    ) {}
}
