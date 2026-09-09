<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Data;

use App\Domain\Passkeys\Models\Passkey;
use Spatie\LaravelData\Data;

class PasskeyData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $createdAt,
        public ?string $lastUsedAt,
        /** Synced to the user's other devices by the passkey provider, so losing one device does not lose it. */
        public bool $backedUp,
    ) {}

    public static function fromModel(Passkey $passkey): self
    {
        return new self(
            id: $passkey->id,
            name: $passkey->name,
            createdAt: $passkey->created_at->toIso8601String(),
            lastUsedAt: $passkey->last_used_at?->toIso8601String(),
            backedUp: $passkey->backed_up,
        );
    }
}
