<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Factories;

use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoicePayment>
 */
class InvoicePaymentFactory extends Factory
{
    #[\Override]
    protected $model = InvoicePayment::class;

    /**
     * A payment for the whole of its invoice, today. Currency precedes the
     * amount: MoneyIntegerCast reads it when it writes the cents.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory()->sent(),
            'user_id' => fn (array $attributes): int => Invoice::query()
                ->whereKey($attributes['invoice_id'])
                ->firstOrFail()
                ->user_id,
            'currency' => fn (array $attributes): string => Invoice::query()
                ->whereKey($attributes['invoice_id'])
                ->firstOrFail()
                ->currency,
            'amount_cents' => fn (array $attributes): int => (int) Invoice::query()
                ->whereKey($attributes['invoice_id'])
                ->firstOrFail()
                ->amount_ttc_cents
                ->getAmount(),
            'paid_on' => CarbonImmutable::today(),
            'bank_movement_id' => null,
            'note' => null,
        ];
    }
}
