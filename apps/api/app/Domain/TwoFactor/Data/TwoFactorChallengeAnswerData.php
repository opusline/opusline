<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use Spatie\LaravelData\Attributes\Validation\Digits;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Data;

class TwoFactorChallengeAnswerData extends Data
{
    public function __construct(
        /** @var non-empty-string|null */
        #[RequiredWithout('recoveryCode'), Digits(6)]
        public ?string $code,
        #[RequiredWithout('code'), Regex('/^[A-Za-z0-9]{10}-[A-Za-z0-9]{10}$/')]
        public ?string $recoveryCode,
        public bool $trustDevice = false,
    ) {}
}
