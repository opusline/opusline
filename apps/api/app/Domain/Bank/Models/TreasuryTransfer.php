<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\Factories\TreasuryTransferFactory;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
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
    'amount_cents',
    'currency',
    'note',
])]
class TreasuryTransfer extends Model
{
    /** @use HasFactory<TreasuryTransferFactory> */
    use HasFactory;

    protected static function newFactory(): TreasuryTransferFactory
    {
        return TreasuryTransferFactory::new();
    }

    /**
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

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
