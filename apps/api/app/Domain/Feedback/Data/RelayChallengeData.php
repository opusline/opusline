<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

/** A puzzle to solve before sending one report: find a nonce whose hash starts with `difficulty` zero bits. */
class RelayChallengeData extends Data
{
    public function __construct(
        public string $challenge,
        public int $difficulty,
        public CarbonImmutable $expiresAt,
    ) {}
}
