<?php

declare(strict_types=1);

namespace App\Domain\Settings\Models;

use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
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
 * @property string $business_country
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
 * @property int $default_vat_rate_bp
 * @property int $default_payment_terms_days
 * @property string $invoice_number_format
 * @property ?Money $treasury_buffer_cents
 * @property ?Money $bank_balance_cents
 * @property ?CarbonImmutable $bank_balance_recorded_on
 * @property ?Money $cfe_expected_cents
 * @property ?string $calendar_token
 * @property ?CarbonImmutable $deadline_reminders_read_at
 * @property bool $calendar_feed_invoices
 * @property bool $calendar_feed_reminders
 * @property bool $calendar_feed_vat
 * @property bool $calendar_feed_urssaf
 * @property bool $calendar_feed_other
 * @property ?CarbonImmutable $calendar_subscribed_on
 * @property ?CarbonImmutable $calendar_last_synced_at
 * @property Currency $currency
 * @property Locale $locale
 * @property DateFormat $date_format
 * @property string $timezone
 * @property int $workday_minutes
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
    'business_country',
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
    'default_vat_rate_bp',
    'default_payment_terms_days',
    'invoice_number_format',
    'treasury_buffer_cents',
    'bank_balance_cents',
    'bank_balance_recorded_on',
    'cfe_expected_cents',
    'calendar_feed_invoices',
    'calendar_feed_reminders',
    'calendar_feed_vat',
    'calendar_feed_urssaf',
    'calendar_feed_other',
    'calendar_subscribed_on',
    'calendar_last_synced_at',
    'currency',
    'locale',
    'date_format',
    'timezone',
    'workday_minutes',
])]
#[Hidden(['calendar_token'])]
#[Table('user_settings')]
class UserSettings extends Model
{
    private ?CarbonImmutable $resolvedToday = null;

    /**
     * The one country whose fiscal machinery (URSSAF, TVA CA3, plafond) the
     * app implements. Every "is this account French?" check reads it here.
     */
    public const string FRENCH_FISCALITY_COUNTRY = 'FR';

    /**
     * The account's own money columns: re-enterable figures rather than records,
     * so a currency change clears them instead of locking on them — carrying
     * their cents into the new currency would silently re-denominate them.
     *
     * @var list<string>
     */
    public const array CURRENCY_SCOPED_COLUMNS = [
        'treasury_buffer_cents',
        'bank_balance_cents',
        'cfe_expected_cents',
    ];

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
            'default_vat_rate_bp' => 'integer',
            'default_payment_terms_days' => 'integer',
            'treasury_buffer_cents' => MoneyIntegerCast::class.':currency',
            'bank_balance_cents' => MoneyIntegerCast::class.':currency',
            'bank_balance_recorded_on' => 'date',
            'cfe_expected_cents' => MoneyIntegerCast::class.':currency',
            'deadline_reminders_read_at' => 'datetime',
            'calendar_feed_invoices' => 'boolean',
            'calendar_feed_reminders' => 'boolean',
            'calendar_feed_vat' => 'boolean',
            'calendar_feed_urssaf' => 'boolean',
            'calendar_feed_other' => 'boolean',
            'calendar_subscribed_on' => 'date',
            'calendar_last_synced_at' => 'datetime',
            'currency' => Currency::class,
            'locale' => Locale::class,
            'date_format' => DateFormat::class,
            'workday_minutes' => 'integer',
        ];
    }

    /**
     * The account's current calendar date. Every fiscally load-bearing "today"
     * — paid_on, sent_on, issued_on defaults and their not-in-the-future rules —
     * resolves here, so a payment recorded at 00:30 in Paris lands on the Paris
     * date, not the previous UTC one.
     *
     * Returned at UTC midnight: the timezone only decides which date it is, and
     * every stored date column is a UTC-midnight instant, so the result compares
     * and stores without cross-timezone off-by-ones.
     */
    public function today(): CarbonImmutable
    {
        // Memoized: isLate() asks per invoice row, and the instance lives one request.
        return $this->resolvedToday ??= CarbonImmutable::parse(CarbonImmutable::today($this->timezone)->toDateString());
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

    /**
     * The TVA rate a new invoice starts on; see config/fiscality.php.
     *
     * @param  ?int  $clientRateBp  The client's own rate, when it has one. Null means it
     *                              follows the account, so raising the default moves that
     *                              client too; 0 means a client who is never charged TVA.
     *                              The regime still wins over both: under the franchise en
     *                              base there is no rate to charge anyone.
     */
    public function effectiveVatRateBp(?int $clientRateBp = null): int
    {
        return $this->vat_regime->isLiable() ? $clientRateBp ?? $this->default_vat_rate_bp : 0;
    }

    /**
     * Whether the French fiscal helpers (URSSAF, TVA CA3, plafond micro-BNC,
     * « combien je peux me virer ») apply to this account.
     *
     * Keyed on where the business is registered, never on the currency — a
     * freelance in Germany invoices euros without URSSAF existing for them.
     * Every gate that hides the fiscal module reads this one predicate.
     */
    public function hasFrenchFiscality(): bool
    {
        return $this->business_country === self::FRENCH_FISCALITY_COUNTRY;
    }
}
