<?php

declare(strict_types=1);

namespace App\Domain\Bank\Factories;

use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PersonalTransfer>
 */
class PersonalTransferFactory extends Factory
{
    protected $model = PersonalTransfer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'transferred_on' => CarbonImmutable::today(),
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'amount_cents' => 300_000,
            'note' => 'Salaire',
        ];
    }

    public function of(int $cents): static
    {
        return $this->state(fn (array $attributes): array => [
            'amount_cents' => $cents,
        ]);
    }

    public function on(string $date): static
    {
        return $this->state(fn (array $attributes): array => [
            'transferred_on' => CarbonImmutable::parse($date),
        ]);
    }
}
