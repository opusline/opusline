<?php

declare(strict_types=1);

namespace App\Domain\Missions\Factories;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mission>
 */
class MissionFactory extends Factory
{
    protected $model = Mission::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'user_id' => fn (array $attributes): int => Client::query()
                ->whereKey($attributes['client_id'])
                ->firstOrFail()
                ->user_id,
            'name' => fake()->words(2, true),
            'billing_mode' => BillingMode::Daily,
            'currency' => 'EUR',
            'rate_cents' => 55_000,
            'status' => MissionStatus::Active,
            'start_date' => null,
            'end_date' => null,
            'end_client_id' => null,
        ];
    }

    /**
     * Indicate that the mission is billed by the hour.
     */
    public function hourly(): static
    {
        return $this->state(fn (array $attributes): array => [
            'billing_mode' => BillingMode::Hourly,
            'rate_cents' => 8_500,
        ]);
    }

    /**
     * Indicate that the mission is not billable (personal/internal project).
     */
    public function nonBillable(): static
    {
        return $this->state(fn (array $attributes): array => [
            'rate_cents' => null,
        ]);
    }

    /**
     * Indicate that the mission is paused.
     */
    public function paused(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => MissionStatus::Paused,
        ]);
    }

    /**
     * Indicate that the mission is done.
     */
    public function done(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => MissionStatus::Done,
        ]);
    }

    /**
     * Indicate that billing goes through an intermediary (ESN).
     */
    public function throughEsn(Client $endClient): static
    {
        return $this->state(fn (array $attributes): array => [
            'end_client_id' => $endClient->id,
        ]);
    }
}
