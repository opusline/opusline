<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use App\Domain\TwoFactor\Totp\TotpSecret;
use Spatie\LaravelData\Data;

class TotpSetupData extends Data
{
    public function __construct(
        public string $secret,
        public string $otpauthUri,
    ) {}

    public static function forSecret(string $secret, string $accountLabel): self
    {
        return new self(
            secret: $secret,
            otpauthUri: TotpSecret::provisioningUri($secret, $accountLabel),
        );
    }
}
