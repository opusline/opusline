<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Factories;

use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TimeEntry>
 */
class TimeEntryFactory extends Factory
{
    protected $model = TimeEntry::class;

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
            'date' => now()->toDateString(),
            'duration_minutes' => 420,
            'note' => null,
        ];
    }
}
