<?php

declare(strict_types=1);

namespace App\Domain\Timers\Factories;

use App\Domain\Missions\Models\Mission;
use App\Domain\Timers\Models\RunningTimer;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RunningTimer>
 */
class RunningTimerFactory extends Factory
{
    protected $model = RunningTimer::class;

    /**
     * A timer that has banked an hour and is no longer accruing.
     */
    public function paused(): static
    {
        return $this->state(fn (): array => [
            'running_since' => null,
            'accumulated_seconds' => 3_600,
        ]);
    }

    public function startedAt(CarbonImmutable $at): static
    {
        return $this->state(fn (): array => [
            'started_at' => $at,
            'running_since' => $at,
        ]);
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startedAt = CarbonImmutable::now();

        return [
            'mission_id' => Mission::factory(),
            'user_id' => fn (array $attributes): int => Mission::query()
                ->whereKey($attributes['mission_id'])
                ->firstOrFail()
                ->user_id,
            'started_at' => $startedAt,
            'running_since' => $startedAt,
            'accumulated_seconds' => 0,
            'note' => null,
        ];
    }
}
