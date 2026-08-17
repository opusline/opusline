<?php

declare(strict_types=1);

namespace App\Domain\Users\Models;

use App\Domain\Bank\Models\BankMatch;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Models\Cra;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Factories\UserFactory;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
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
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Fillable(['name', 'email', 'password', 'release_notes_seen_version'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

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
        $this->addMediaCollection('documents');
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
        ];
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
     * Whether the account currency can still change. It is fixed the moment any
     * amount is stored in it — a priced mission, an invoice or an imported bank
     * statement — so every stored amount provably shares one currency and
     * aggregations never have to guard against a mix.
     */
    public function hasLockedCurrency(): bool
    {
        if ($this->missions()->whereNotNull('rate_cents')->exists()) {
            return true;
        }

        if ($this->invoices()->exists()) {
            return true;
        }

        // Movements imply statements (their statement key is required), so
        // checking statements covers every imported bank amount.
        return $this->bankStatements()->exists();
    }
}
