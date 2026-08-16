<?php

declare(strict_types=1);

namespace App\Domain\Bank\Factories;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BankMovement>
 */
class BankMovementFactory extends Factory
{
    protected $model = BankMovement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bank_statement_id' => BankStatement::factory(),
            'user_id' => fn (array $attributes): int => BankStatement::query()
                ->whereKey($attributes['bank_statement_id'])
                ->firstOrFail()
                ->user_id,
            'invoice_id' => null,
            'booked_on' => CarbonImmutable::today(),
            'label' => 'VIR SEPA NORDLYS',
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'amount_cents' => 100_000,
            'dedup_hash' => fn (): string => hash('sha256', Str::uuid()->toString()),
        ];
    }

    public function credit(int $cents = 100_000): static
    {
        return $this->state(fn (array $attributes): array => [
            'amount_cents' => abs($cents),
        ]);
    }

    public function debit(int $cents = 50_000): static
    {
        return $this->state(fn (array $attributes): array => [
            'amount_cents' => -abs($cents),
        ]);
    }

    public function on(string $date): static
    {
        return $this->state(fn (array $attributes): array => [
            'booked_on' => CarbonImmutable::parse($date),
        ]);
    }
}
