<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Factories;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Models\SubscriptionAmount;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'supplier' => 'Nordlys Cloud',
            'category' => ExpenseCategory::Hosting,
            'description' => 'Hébergement · plan Pro',
            'vat_treatment' => ExpenseVatTreatment::Domestic,
            'vat_rate_bp' => 2_000,
            'pro_share_bp' => Rate::BASIS_POINTS,
            'periodicity' => SubscriptionPeriodicity::Monthly,
            'debit_day' => 5,
            'debit_month' => null,
            'started_on' => CarbonImmutable::parse('2026-01-05'),
            'cancelled_on' => null,
            'is_paused' => false,
            'auto_create_expenses' => true,
            'provision_monthly' => false,
            'customer_space_url' => null,
            'currency' => 'EUR',
        ];
    }

    /**
     * The opening price, dated at the start: every subscription needs one
     * row in force from its first debit.
     */
    #[\Override]
    public function configure(): static
    {
        return $this->afterCreating(function (Subscription $subscription): void {
            if ($subscription->amounts()->doesntExist()) {
                SubscriptionAmount::factory()->for($subscription)->create([
                    'effective_from' => $subscription->started_on,
                    'currency' => $subscription->currency,
                    'amount_ht_cents' => 2_400,
                ]);
            }
        });
    }

    public function startedOn(string $date): static
    {
        return $this->state(fn (array $attributes): array => ['started_on' => CarbonImmutable::parse($date)]);
    }

    public function monthly(int $debitDay = 5): static
    {
        return $this->state(fn (array $attributes): array => [
            'periodicity' => SubscriptionPeriodicity::Monthly,
            'debit_day' => $debitDay,
            'debit_month' => null,
        ]);
    }

    public function quarterly(int $debitDay = 5): static
    {
        return $this->state(fn (array $attributes): array => [
            'periodicity' => SubscriptionPeriodicity::Quarterly,
            'debit_day' => $debitDay,
            'debit_month' => null,
        ]);
    }

    public function annual(int $debitDay, int $debitMonth): static
    {
        return $this->state(fn (array $attributes): array => [
            'periodicity' => SubscriptionPeriodicity::Annual,
            'debit_day' => $debitDay,
            'debit_month' => $debitMonth,
        ]);
    }

    /** The opening price, in place of the factory's default one. */
    public function priced(int $htCents): static
    {
        return $this->has(SubscriptionAmount::factory()->state(function (array $attributes, ?Model $subscription) use ($htCents): array {
            assert($subscription instanceof Subscription);

            return [
                'effective_from' => $subscription->started_on,
                'currency' => $subscription->currency,
                'amount_ht_cents' => $htCents,
            ];
        }), 'amounts');
    }

    public function named(string $supplier, ExpenseCategory $category): static
    {
        return $this->state(fn (array $attributes): array => ['supplier' => $supplier, 'category' => $category]);
    }

    public function exempt(): static
    {
        return $this->state(fn (array $attributes): array => ['vat_treatment' => ExpenseVatTreatment::Exempt, 'vat_rate_bp' => 0]);
    }

    public function paused(): static
    {
        return $this->state(fn (array $attributes): array => ['is_paused' => true]);
    }

    public function cancelledOn(string $date): static
    {
        return $this->state(fn (array $attributes): array => ['cancelled_on' => CarbonImmutable::parse($date)]);
    }

    public function provisioned(): static
    {
        return $this->state(fn (array $attributes): array => ['provision_monthly' => true]);
    }

    public function reverseCharged(ExpenseVatTreatment $treatment = ExpenseVatTreatment::ReverseChargeNonEu, int $rateBp = 2_000): static
    {
        return $this->state(fn (array $attributes): array => [
            'vat_treatment' => $treatment,
            'vat_rate_bp' => $rateBp,
        ]);
    }
}
