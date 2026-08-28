<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Factories;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FiscalDeadlineCompletion>
 */
class FiscalDeadlineCompletionFactory extends Factory
{
    protected $model = FiscalDeadlineCompletion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'kind' => FiscalDeadlineKind::UrssafDeclaration,
            'period_key' => '2026-07',
            'due_on' => CarbonImmutable::parse('2026-08-31'),
            'completed_on' => CarbonImmutable::parse('2026-08-13'),
        ];
    }

    public function of(FiscalDeadlineKind $kind, string $periodKey): static
    {
        return $this->state(fn (array $attributes): array => [
            'kind' => $kind,
            'period_key' => $periodKey,
        ]);
    }

    public function dueOn(string $date): static
    {
        return $this->state(fn (array $attributes): array => [
            'due_on' => CarbonImmutable::parse($date),
        ]);
    }

    public function completedOn(string $date): static
    {
        return $this->state(fn (array $attributes): array => [
            'completed_on' => CarbonImmutable::parse($date),
        ]);
    }
}
