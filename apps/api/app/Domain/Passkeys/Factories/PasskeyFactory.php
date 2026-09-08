<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Factories;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use ParagonIE\ConstantTime\Base64UrlSafe;

/**
 * @extends Factory<Passkey>
 */
class PasskeyFactory extends Factory
{
    protected $model = Passkey::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => 'Clé de secours',
            'credential_id' => Base64UrlSafe::encodeUnpadded(random_bytes(32)),
            'public_key' => base64_encode(random_bytes(77)),
            'counter' => 0,
            'transports' => ['internal'],
            'aaguid' => null,
            'backup_eligible' => true,
            'backed_up' => true,
            'last_used_at' => null,
        ];
    }
}
