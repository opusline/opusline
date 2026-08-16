<?php

declare(strict_types=1);

namespace App\Domain\Bank\Factories;

use App\Domain\Bank\Enums\BankMatchReason;
use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BankMatch>
 */
class BankMatchFactory extends Factory
{
    protected $model = BankMatch::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bank_movement_id' => BankMovement::factory(),
            'user_id' => fn (array $attributes): int => BankMovement::query()
                ->whereKey($attributes['bank_movement_id'])
                ->firstOrFail()
                ->user_id,
            // The invoice must belong to the movement's account — a match is a
            // same-tenant pairing, and nothing downstream re-checks it.
            'invoice_id' => function (array $attributes): int {
                $movement = BankMovement::query()
                    ->whereKey($attributes['bank_movement_id'])
                    ->firstOrFail();

                return Invoice::factory()
                    ->sent()
                    ->for(Client::factory()->for($movement->user), 'client')
                    ->create(['user_id' => $movement->user_id])
                    ->id;
            },
            'status' => BankMatchStatus::Pending,
            'reason' => BankMatchReason::RefInLabel,
        ];
    }

    public function validated(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => BankMatchStatus::Validated,
        ]);
    }

    public function dismissed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => BankMatchStatus::Dismissed,
        ]);
    }
}
