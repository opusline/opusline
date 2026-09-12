<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Factories;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\ExpenseAmounts;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'supplier' => 'Tessaline Télécom',
            'category' => ExpenseCategory::Phone,
            'description' => 'Forfait mobile',
            'spent_on' => CarbonImmutable::today(),
            'vat_claim_period' => function (array $attributes): string {
                $spentOn = $attributes['spent_on'];
                assert($spentOn instanceof CarbonImmutable || is_string($spentOn));

                return CarbonImmutable::parse($spentOn)->format('Y-m');
            },
            'vat_treatment' => ExpenseVatTreatment::Domestic,
            'vat_rate_bp' => 2_000,
            'pro_share_bp' => Rate::BASIS_POINTS,
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'amount_ttc_cents' => 2_900,
            'amount_ht_cents' => (int) ExpenseAmounts::fromTtc(new Money(2_900, 'EUR'), ExpenseVatTreatment::Domestic, 2_000)->ht->getAmount(),
        ];
    }

    public function on(string $date): static
    {
        return $this->state(fn (array $attributes): array => [
            'spent_on' => CarbonImmutable::parse($date),
        ]);
    }

    /** A domestic purchase of $ttcCents at $rateBp, HT derived the way the domain does. */
    public function ttc(int $ttcCents, int $rateBp = 2_000): static
    {
        return $this->state(function (array $attributes) use ($ttcCents, $rateBp): array {
            $currency = $attributes['currency'];
            assert(is_string($currency));

            return [
                'vat_treatment' => ExpenseVatTreatment::Domestic,
                'vat_rate_bp' => $rateBp,
                'amount_ttc_cents' => $ttcCents,
                'amount_ht_cents' => (int) ExpenseAmounts::fromTtc(
                    new Money($ttcCents, $currency),
                    ExpenseVatTreatment::Domestic,
                    $rateBp,
                )->ht->getAmount(),
            ];
        });
    }

    /** A reverse-charged purchase: the receipt carries no TVA, HT equals TTC. */
    public function reverseCharged(int $htCents, ExpenseVatTreatment $treatment = ExpenseVatTreatment::ReverseChargeNonEu, int $rateBp = 2_000): static
    {
        return $this->state(fn (array $attributes): array => [
            'vat_treatment' => $treatment,
            'vat_rate_bp' => $rateBp,
            'amount_ttc_cents' => $htCents,
            'amount_ht_cents' => $htCents,
        ]);
    }

    public function exempt(int $cents): static
    {
        return $this->state(fn (array $attributes): array => [
            'vat_treatment' => ExpenseVatTreatment::Exempt,
            'vat_rate_bp' => 0,
            'amount_ttc_cents' => $cents,
            'amount_ht_cents' => $cents,
        ]);
    }

    public function category(ExpenseCategory $category): static
    {
        return $this->state(fn (array $attributes): array => [
            'category' => $category,
        ]);
    }

    public function proShare(int $proShareBp): static
    {
        return $this->state(fn (array $attributes): array => [
            'pro_share_bp' => $proShareBp,
        ]);
    }
}
