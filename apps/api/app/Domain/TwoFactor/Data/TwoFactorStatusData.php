<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class TwoFactorStatusData extends Data
{
    /**
     * @param  list<TrustedDeviceData>  $trustedDevices
     */
    public function __construct(
        public bool $totpEnabled,
        public ?string $totpConfirmedAt,
        public int $recoveryCodesRemaining,
        #[DataCollectionOf(TrustedDeviceData::class)]
        public array $trustedDevices,
    ) {}

    /**
     * @param  ?string  $currentTokenHash  hash of the trusted-device token this request carries, if any
     */
    public static function fromModel(User $user, ?string $currentTokenHash): self
    {
        $trustedDevices = array_values($user->trustedDevices()
            ->where('expires_at', '>', now())
            ->orderByDesc('last_used_at')
            ->get()
            ->map(fn (TrustedDevice $device): TrustedDeviceData => TrustedDeviceData::fromModel(
                $device,
                current: $currentTokenHash !== null && hash_equals($device->token_hash, $currentTokenHash),
            ))
            ->all());

        return new self(
            totpEnabled: $user->hasTotpEnabled(),
            totpConfirmedAt: $user->totp_confirmed_at?->toIso8601String(),
            recoveryCodesRemaining: count($user->two_factor_recovery_codes ?? []),
            trustedDevices: $trustedDevices,
        );
    }
}
