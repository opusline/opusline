<?php

declare(strict_types=1);

namespace App\Domain\Missions\Factories;

use App\Domain\Missions\Models\MissionBillingStep;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MissionBillingStep>
 */
class MissionBillingStepFactory extends Factory
{
    protected $model = MissionBillingStep::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => 'Acompte',
            'currency' => 'EUR',
            'amount_cents' => 240_000,
            'position' => 0,
            'due_on' => null,
            'ready_at' => null,
            'invoice_id' => null,
        ];
    }

    /** Indicate that the step is expected on a given date. */
    public function dueOn(string $date): static
    {
        return $this->state(fn (array $attributes): array => ['due_on' => $date]);
    }

    /** Indicate that the project event behind the step has happened. */
    public function ready(): static
    {
        return $this->state(fn (array $attributes): array => [
            'ready_at' => CarbonImmutable::now(),
        ]);
    }
}
