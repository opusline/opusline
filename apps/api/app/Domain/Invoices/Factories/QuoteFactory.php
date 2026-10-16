<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Factories;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quote>
 */
class QuoteFactory extends Factory
{
    #[\Override]
    protected $model = Quote::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $issuedOn = CarbonImmutable::today();

        return [
            'client_id' => Client::factory(),
            'user_id' => fn (array $attributes): int => Client::query()
                ->whereKey($attributes['client_id'])
                ->firstOrFail()
                ->user_id,
            'mission_id' => null,
            'number' => null,
            'status' => QuoteStatus::Draft,
            'issued_on' => $issuedOn,
            'validity_days' => 30,
            'valid_until' => $issuedOn->addDays(30),
            'deposit_rate_bp' => null,
            'payment_terms_days' => 30,
            'payment_terms_end_of_month' => false,
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'amount_ht_cents' => 165_000,
            'amount_ttc_cents' => 198_000,
            'vat_rate_bp' => 2_000,
        ];
    }

    public function sent(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => QuoteStatus::Sent,
            'number' => fake()->unique()->numerify('D-2026-###'),
        ]);
    }

    public function accepted(): static
    {
        return $this->sent()->state(fn (array $attributes): array => [
            'status' => QuoteStatus::Accepted,
            'accepted_on' => CarbonImmutable::today(),
        ]);
    }

    public function refused(): static
    {
        return $this->sent()->state(fn (array $attributes): array => [
            'status' => QuoteStatus::Refused,
            'refused_on' => CarbonImmutable::today(),
        ]);
    }
}
