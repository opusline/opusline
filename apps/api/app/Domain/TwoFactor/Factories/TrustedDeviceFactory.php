<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Factories;

use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<TrustedDevice>
 */
class TrustedDeviceFactory extends Factory
{
    protected $model = TrustedDevice::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'token_hash' => TrustedDevice::hashToken(Str::random(64)),
            'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
            'ip' => '10.0.0.1',
            'last_used_at' => now(),
            'expires_at' => now()->addDays(TrustedDevice::LIFETIME_DAYS),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes): array => [
            'expires_at' => now()->subDay(),
        ]);
    }
}
