<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\Factories\BankAccountFactory;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * One business account at a bank: the statements imported for it, the
 * movements they carry, at most one connection syncing it, and the balance
 * typed for it by hand.
 *
 * @property int $id
 * @property int $user_id
 * @property ?string $name
 * @property ?string $identification_hash
 * @property ?Money $balance_cents
 * @property ?CarbonImmutable $balance_recorded_on
 * @property string $currency
 * @property ?CarbonImmutable $archived_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 * @property-read ?BankConnection $connection
 */
#[Fillable([
    'name',
    'identification_hash',
    'currency',
    'balance_cents',
    'balance_recorded_on',
    'archived_at',
])]
class BankAccount extends Model
{
    /**
     * Figures the user can type again, so a currency change clears them
     * instead of locking on them, like UserSettings::CURRENCY_SCOPED_COLUMNS.
     *
     * @var list<string>
     */
    public const array CURRENCY_SCOPED_COLUMNS = ['balance_cents'];

    /** @use HasFactory<BankAccountFactory> */
    use HasFactory;

    protected static function newFactory(): BankAccountFactory
    {
        return BankAccountFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'balance_cents' => MoneyIntegerCast::class.':currency',
            'balance_recorded_on' => CalendarDate::class,
            'archived_at' => 'datetime',
        ];
    }

    /**
     * Scope every {account} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->bankAccounts(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<BankStatement, $this> */
    public function statements(): HasMany
    {
        return $this->hasMany(BankStatement::class);
    }

    /** @return HasMany<BankMovement, $this> */
    public function movements(): HasMany
    {
        return $this->hasMany(BankMovement::class);
    }

    /** @return HasOne<BankConnection, $this> */
    public function connection(): HasOne
    {
        return $this->hasOne(BankConnection::class);
    }

    public function isArchived(): bool
    {
        return $this->archived_at !== null;
    }
}
