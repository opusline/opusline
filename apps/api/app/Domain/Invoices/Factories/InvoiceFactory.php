<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Factories;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
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
            'status' => InvoiceStatus::Draft,
            'issued_on' => $issuedOn,
            'due_on' => $issuedOn->addDays(45),
            'paid_on' => null,
            'period_start' => null,
            'period_end' => null,
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'amount_ht_cents' => 165_000,
            'amount_ttc_cents' => 198_000,
            'vat_rate_bp' => 2_000,
            'notes' => null,
        ];
    }

    /**
     * Indicate that the invoice has been issued and is awaiting payment.
     */
    public function sent(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => InvoiceStatus::Sent,
            'number' => fake()->unique()->numerify('2026-###'),
        ]);
    }

    /**
     * Indicate that the invoice has been paid.
     */
    public function paid(): static
    {
        return $this->sent()->state(fn (array $attributes): array => [
            'status' => InvoiceStatus::Paid,
            'paid_on' => CarbonImmutable::today(),
        ]);
    }

    /**
     * Indicate that the invoice is issued and past its due date.
     */
    public function overdue(): static
    {
        return $this->sent()->state(fn (array $attributes): array => [
            'issued_on' => CarbonImmutable::today()->subDays(60),
            'due_on' => CarbonImmutable::today()->subDays(15),
        ]);
    }
}
