<?php

declare(strict_types=1);

namespace App\Domain\Cra\Factories;

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
use App\Domain\Missions\Models\Mission;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cra>
 */
class CraFactory extends Factory
{
    protected $model = Cra::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mission_id' => Mission::factory(),
            'user_id' => fn (array $attributes): int => Mission::query()
                ->whereKey($attributes['mission_id'])
                ->firstOrFail()
                ->user_id,
            'month' => CarbonImmutable::today()->startOfMonth(),
            'status' => CraStatus::Draft,
            'sent_on' => null,
            'signed_on' => null,
            'notes' => null,
        ];
    }

    /**
     * Indicate that the CRA has been handed to the client and awaits a signed return.
     */
    public function sent(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => CraStatus::Sent,
            'sent_on' => CarbonImmutable::today(),
        ]);
    }

    /**
     * Indicate that the client returned the CRA signed.
     */
    public function signed(): static
    {
        return $this->sent()->state(fn (array $attributes): array => [
            'status' => CraStatus::Signed,
            'signed_on' => CarbonImmutable::today(),
        ]);
    }

    /**
     * Place the CRA on a given month, given as `Y-m` — the format the API speaks.
     */
    public function forMonth(string $month): static
    {
        return $this->state(fn (array $attributes): array => [
            'month' => CarbonImmutable::parse($month.'-01'),
        ]);
    }
}
