<?php

declare(strict_types=1);

namespace App\Domain\Settings\Factories;

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserSettings>
 */
class UserSettingsFactory extends Factory
{
    protected $model = UserSettings::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'home_address_same_as_company' => true,
            'urssaf_periodicity' => UrssafPeriodicity::Monthly,
            'contribution_rate_bp' => 2600,
            'liberating_payment' => false,
            'liberating_payment_rate_bp' => 220,
            'vat_regime' => VatRegime::FranchiseEnBase,
            'default_payment_terms_days' => 45,
            'invoice_number_format' => 'AAAA-NNN',
            'treasury_buffer_cents' => null,
            'currency' => Currency::EUR->value,
        ];
    }
}
