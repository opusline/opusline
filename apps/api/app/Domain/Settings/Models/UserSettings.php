<?php

declare(strict_types=1);

namespace App\Domain\Settings\Models;

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Factories\UserSettingsFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property ?string $trade_name
 * @property ?string $siret
 * @property ?string $vat_number
 * @property ?string $signature_city
 * @property ?string $contact_email
 * @property ?string $phone
 * @property ?string $company_address_line1
 * @property ?string $company_address_line2
 * @property ?string $company_postal_code
 * @property ?string $company_city
 * @property bool $home_address_same_as_company
 * @property ?string $home_address_line1
 * @property ?string $home_address_line2
 * @property ?string $home_postal_code
 * @property ?string $home_city
 * @property UrssafPeriodicity $urssaf_periodicity
 * @property bool $auto_rates
 * @property ?CarbonImmutable $rates_checked_at
 * @property ?int $rates_year
 * @property bool $acre
 * @property ?CarbonImmutable $business_started_on
 * @property int $contribution_rate_bp
 * @property bool $liberating_payment
 * @property int $liberating_payment_rate_bp
 * @property VatRegime $vat_regime
 * @property int $default_payment_terms_days
 * @property string $invoice_number_format
 * @property ?Money $treasury_buffer_cents
 * @property string $currency
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Fillable([
    'trade_name',
    'siret',
    'vat_number',
    'signature_city',
    'contact_email',
    'phone',
    'company_address_line1',
    'company_address_line2',
    'company_postal_code',
    'company_city',
    'home_address_same_as_company',
    'home_address_line1',
    'home_address_line2',
    'home_postal_code',
    'home_city',
    'urssaf_periodicity',
    'auto_rates',
    'rates_checked_at',
    'rates_year',
    'acre',
    'business_started_on',
    'contribution_rate_bp',
    'liberating_payment',
    'liberating_payment_rate_bp',
    'vat_regime',
    'default_payment_terms_days',
    'invoice_number_format',
    'treasury_buffer_cents',
    'currency',
])]
#[Table('user_settings')]
class UserSettings extends Model
{
    /** @use HasFactory<UserSettingsFactory> */
    use HasFactory;

    protected static function newFactory(): UserSettingsFactory
    {
        return UserSettingsFactory::new();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'home_address_same_as_company' => 'boolean',
            'urssaf_periodicity' => UrssafPeriodicity::class,
            'auto_rates' => 'boolean',
            'rates_checked_at' => 'datetime',
            'rates_year' => 'integer',
            'acre' => 'boolean',
            'business_started_on' => 'date',
            'contribution_rate_bp' => 'integer',
            'liberating_payment' => 'boolean',
            'liberating_payment_rate_bp' => 'integer',
            'vat_regime' => VatRegime::class,
            'default_payment_terms_days' => 'integer',
            'treasury_buffer_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function effectiveContributionRateBp(): int
    {
        return $this->contribution_rate_bp
            + ($this->liberating_payment ? $this->liberating_payment_rate_bp : 0);
    }
}
