<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Models;

use App\Domain\Expenses\Factories\SubscriptionAmountFactory;
use App\Domain\Shared\Casts\CalendarDate;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One price of a subscription and the day it took effect. The row in force
 * on a debit date is the latest one dated on or before it.
 *
 * @property int $id
 * @property int $subscription_id
 * @property CarbonImmutable $effective_from
 * @property Money $amount_ht_cents
 * @property string $currency
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Subscription $subscription
 */
#[Fillable([
    'effective_from',
    'currency',
    'amount_ht_cents',
])]
class SubscriptionAmount extends Model
{
    /** @use HasFactory<SubscriptionAmountFactory> */
    use HasFactory;

    protected static function newFactory(): SubscriptionAmountFactory
    {
        return SubscriptionAmountFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'effective_from' => CalendarDate::class,
            'amount_ht_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /** @return BelongsTo<Subscription, $this> */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
