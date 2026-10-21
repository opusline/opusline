<?php

declare(strict_types=1);

namespace App\Domain\Bank\Factories;

use App\Domain\Bank\Models\BankAccount;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BankAccount>
 */
class BankAccountFactory extends Factory
{
    #[\Override]
    protected $model = BankAccount::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => null,
            'identification_hash' => null,
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'balance_cents' => null,
            'balance_recorded_on' => null,
            'archived_at' => null,
        ];
    }

    public function withBalance(int $cents, string $recordedOn): static
    {
        return $this->state(fn (array $attributes): array => [
            'balance_cents' => $cents,
            'balance_recorded_on' => CarbonImmutable::parse($recordedOn),
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes): array => [
            'archived_at' => CarbonImmutable::now(),
        ]);
    }

    /**
     * The account a factory row lands in when the test names none: the
     * user's first one, so a test written for the single-account world keeps
     * summing every statement into one balance.
     */
    public static function firstOf(mixed $userId): int
    {
        $existing = BankAccount::query()->where('user_id', $userId)->orderBy('id')->first();

        return ($existing ?? BankAccount::factory()->create(['user_id' => $userId]))->id;
    }
}
