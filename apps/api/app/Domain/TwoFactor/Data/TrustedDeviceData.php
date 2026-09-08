<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use App\Domain\TwoFactor\Devices\UserAgentLabel;
use App\Domain\TwoFactor\Models\TrustedDevice;
use Spatie\LaravelData\Data;

class TrustedDeviceData extends Data
{
    public function __construct(
        public int $id,
        public ?string $browser,
        public ?string $platform,
        public ?string $lastUsedAt,
        public string $expiresAt,
        /** The browser making this request, so the list can say "this one". */
        public bool $current,
    ) {}

    public static function fromModel(TrustedDevice $device, bool $current): self
    {
        $label = UserAgentLabel::parse($device->user_agent);

        return new self(
            id: $device->id,
            browser: $label->browser,
            platform: $label->platform,
            lastUsedAt: $device->last_used_at?->toIso8601String(),
            expiresAt: $device->expires_at->toIso8601String(),
            current: $current,
        );
    }
}
