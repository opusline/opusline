<?php

declare(strict_types=1);

namespace App\Domain\Users\Models;

use App\Domain\Bank\Models\BankMatch;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Models\Cra;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Documents\Concerns\InteractsWithDocuments;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Factories\UserFactory;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property ?CarbonImmutable $email_verified_at
 * @property string $password
 * @property Theme $theme
 * @property ?string $release_notes_seen_version
 * @property ?string $totp_secret
 * @property ?CarbonImmutable $totp_confirmed_at
 * @property ?int $totp_last_used_step
 * @property ?list<string> $two_factor_recovery_codes
 * @property ?string $passkey_user_handle
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Fillable(['name', 'email', 'password', 'release_notes_seen_version'])]
#[Hidden(['password', 'remember_token', 'totp_secret', 'totp_confirmed_at', 'totp_last_used_step', 'two_factor_recovery_codes', 'passkey_user_handle'])]
class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use InteractsWithDocuments;
    use InteractsWithMedia;
    use Notifiable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'theme' => Theme::System->value,
    ];

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('signature')->singleFile();
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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'theme' => Theme::class,
            'totp_secret' => 'encrypted',
            'totp_confirmed_at' => 'datetime',
            'two_factor_recovery_codes' => 'encrypted:array',
        ];
    }

    public function hasTotpEnabled(): bool
    {
        return $this->totp_confirmed_at !== null;
    }

    /** Whether a password login is challenged: any enrolled method counts. */
    public function hasTwoFactorEnabled(): bool
    {
        if ($this->hasTotpEnabled()) {
            return true;
        }

        return $this->passkeys()->exists();
    }

    /** @return HasMany<Client, $this> */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    /** @return HasMany<Mission, $this> */
    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }

    /** @return HasMany<TimeEntry, $this> */
    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /** @return HasMany<Cra, $this> */
    public function cras(): HasMany
    {
        return $this->hasMany(Cra::class);
    }

    /** @return HasOne<RunningTimer, $this> */
    public function runningTimer(): HasOne
    {
        return $this->hasOne(RunningTimer::class);
    }

    /** @return HasMany<BankStatement, $this> */
    public function bankStatements(): HasMany
    {
        return $this->hasMany(BankStatement::class);
    }

    /** @return HasMany<BankMovement, $this> */
    public function bankMovements(): HasMany
    {
        return $this->hasMany(BankMovement::class);
    }

    /** @return HasMany<BankMatch, $this> */
    public function bankMatches(): HasMany
    {
        return $this->hasMany(BankMatch::class);
    }

    /** @return HasMany<PersonalTransfer, $this> */
    public function personalTransfers(): HasMany
    {
        return $this->hasMany(PersonalTransfer::class);
    }

    /** @return HasMany<Expense, $this> */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /** @return HasMany<Subscription, $this> */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /** @return HasMany<FiscalDeadlineCompletion, $this> */
    public function fiscalDeadlineCompletions(): HasMany
    {
        return $this->hasMany(FiscalDeadlineCompletion::class);
    }

    /** @return HasMany<TrustedDevice, $this> */
    public function trustedDevices(): HasMany
    {
        return $this->hasMany(TrustedDevice::class);
    }

    /** @return HasMany<Passkey, $this> */
    public function passkeys(): HasMany
    {
        return $this->hasMany(Passkey::class);
    }

    /**
     * Serialize an account-level invariant on the user row. Every write that
     * checks-then-writes across an account's rows — one timer per user, the
     * currency lock, invoice numbering, billing-mode immutability — takes this
     * same lock first, inside its transaction, so the checks cannot race.
     */
    public static function lockRow(int $userId): self
    {
        return self::query()->whereKey($userId)->lockForUpdate()->firstOrFail();
    }

    /**
     * The settings row every account owns. Reads the loaded relation when
     * available and queries once otherwise; reach for settings()->sole() only
     * under lockForUpdate, where the fresh read is the point.
     */
    public function settingsOrFail(): UserSettings
    {
        return $this->settings ?? $this->settings()->sole();
    }

    /** @return HasOne<UserSettings, $this> */
    public function settings(): HasOne
    {
        return $this->hasOne(UserSettings::class);
    }

    /**
     * Every money column that fixes the account currency once it holds a value,
     * as owning table => columns. A column belongs here when it is a record the
     * account cannot simply retype; the re-enterable figures are in
     * UserSettings::CURRENCY_SCOPED_COLUMNS and are cleared instead.
     *
     * CurrencyCoverageTest asserts every money-cast column appears in one list
     * or the other.
     *
     * @var array<string, list<string>>
     */
    public const array CURRENCY_LOCKING_COLUMNS = [
        'missions' => ['rate_cents', 'reference_daily_rate_cents'],
        'invoices' => ['amount_ht_cents', 'amount_ttc_cents'],
        'bank_statements' => ['closing_balance_cents'],
        'bank_movements' => ['amount_cents'],
        'personal_transfers' => ['amount_cents'],
        'expenses' => ['amount_ttc_cents', 'amount_ht_cents'],
        'subscription_amounts' => ['amount_ht_cents'],
    ];

    /**
     * Whether the account currency can still change. It is fixed the moment any
     * amount is stored in it — a priced mission, an invoice, an imported bank
     * statement, a recorded personal transfer, an expense or a priced
     * subscription — so every stored amount
     * provably shares one currency and aggregations never have to guard
     * against a mix.
     */
    public function hasLockedCurrency(): bool
    {
        $hasPricedMission = $this->missions()
            ->where(fn (Builder $mission) => $mission
                ->whereNotNull('rate_cents')
                ->orWhereNotNull('reference_daily_rate_cents'))
            ->exists();

        if ($hasPricedMission) {
            return true;
        }

        if ($this->invoices()->exists()) {
            return true;
        }

        // Movements imply statements (their statement key is required), so
        // checking statements covers every imported bank amount.
        if ($this->bankStatements()->exists()) {
            return true;
        }

        if ($this->personalTransfers()->exists()) {
            return true;
        }

        if ($this->expenses()->exists()) {
            return true;
        }

        // Every subscription carries its opening price, so the subscription
        // row is the amount's witness.
        return $this->subscriptions()->exists();
    }
}
