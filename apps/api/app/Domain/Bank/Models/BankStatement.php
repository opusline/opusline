<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Factories\BankStatementFactory;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $file_name
 * @property BankStatementFormat $format
 * @property CarbonImmutable $period_start
 * @property CarbonImmutable $period_end
 * @property int $line_count
 * @property ?Money $closing_balance_cents
 * @property ?CarbonImmutable $closing_balance_on
 * @property string $currency
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable([
    'file_name',
    'format',
    'period_start',
    'period_end',
    'line_count',
    'currency',
    'closing_balance_cents',
    'closing_balance_on',
])]
class BankStatement extends Model
{
    /** @use HasFactory<BankStatementFactory> */
    use HasFactory;

    protected static function newFactory(): BankStatementFactory
    {
        return BankStatementFactory::new();
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
            'format' => BankStatementFormat::class,
            'period_start' => CalendarDate::class,
            'period_end' => CalendarDate::class,
            'line_count' => 'integer',
            'closing_balance_cents' => MoneyIntegerCast::class.':currency',
            'closing_balance_on' => CalendarDate::class,
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<BankMovement, $this> */
    public function movements(): HasMany
    {
        return $this->hasMany(BankMovement::class);
    }
}
