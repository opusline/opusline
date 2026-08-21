<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\Factories\PersonalTransferFactory;
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

/**
 * A transfer the user made from the pro account to their personal one. Opusline
 * never executes it — the row is what the user typed after doing it at their
 * bank, and it stands in for the debit until a statement carries it.
 *
 * @property int $id
 * @property int $user_id
 * @property CarbonImmutable $transferred_on
 * @property Money $amount_cents
 * @property string $currency
 * @property ?string $note
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable([
    'transferred_on',
    'currency',
    'amount_cents',
    'note',
])]
class PersonalTransfer extends Model
{
    /** @use HasFactory<PersonalTransferFactory> */
    use HasFactory;

    protected static function newFactory(): PersonalTransferFactory
    {
        return PersonalTransferFactory::new();
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
            'transferred_on' => CalendarDate::class,
            'amount_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /**
     * Scope every {transfer} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->personalTransfers(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
