<?php

declare(strict_types=1);

namespace App\Domain\Bank\Factories;

use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BankStatement>
 */
class BankStatementFactory extends Factory
{
    protected $model = BankStatement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $periodEnd = CarbonImmutable::today();

        return [
            'user_id' => User::factory(),
            'file_name' => 'releve-compte-pro.csv',
            'format' => BankStatementFormat::Csv,
            'period_start' => $periodEnd->subDays(30),
            'period_end' => $periodEnd,
            'line_count' => 5,
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'closing_balance_cents' => null,
            'closing_balance_on' => null,
        ];
    }

    public function withClosingBalance(int $cents, string $on): static
    {
        return $this->state(fn (array $attributes): array => [
            'closing_balance_cents' => $cents,
            'closing_balance_on' => CarbonImmutable::parse($on),
        ]);
    }
}
