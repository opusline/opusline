<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use App\Domain\Users\Models\User;
use Spatie\LaravelData\Data;

class TwoFactorStatusData extends Data
{
    public function __construct(
        public bool $totpEnabled,
        public ?string $totpConfirmedAt,
        public int $recoveryCodesRemaining,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            totpEnabled: $user->hasTotpEnabled(),
            totpConfirmedAt: $user->totp_confirmed_at?->toIso8601String(),
            recoveryCodesRemaining: count($user->two_factor_recovery_codes ?? []),
        );
    }
}
