<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Factories;

use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Models\SubscriptionAmount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SubscriptionAmount>
 */
class SubscriptionAmountFactory extends Factory
{
    protected $model = SubscriptionAmount::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subscription_id' => Subscription::factory(),
            // Not the opening price's day: the parent factory already writes
            // that row, and the pair is unique.
            'effective_from' => CarbonImmutable::parse('2026-06-01'),
            // Currency before the cents key: MoneyIntegerCast reads it when
            // it writes the amount.
            'currency' => 'EUR',
            'amount_ht_cents' => 2_400,
        ];
    }
}
