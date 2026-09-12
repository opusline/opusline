<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Models;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use App\Domain\Expenses\Vat\ExpenseAmounts;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use InvalidArgumentException;
use Money\Money as MoneyPhp;

/**
 * A recurring purchase: what it is, when it debits, and how its TVA reads —
 * everything an occurrence copies onto the expense it becomes. The amount
 * lives in the history rows (SubscriptionAmount), never here, so a price
 * change dated in the past re-prices exactly the debits it covers.
 *
 * @property int $id
 * @property int $user_id
 * @property string $supplier
 * @property ExpenseCategory $category
 * @property ?string $description
 * @property ExpenseVatTreatment $vat_treatment
 * @property int $vat_rate_bp
 * @property int $pro_share_bp
 * @property SubscriptionPeriodicity $periodicity
 * @property int $debit_day
 * @property ?int $debit_month
 * @property CarbonImmutable $started_on
 * @property ?CarbonImmutable $occurrences_from
 * @property ?CarbonImmutable $cancelled_on
 * @property bool $is_paused
 * @property bool $auto_create_expenses
 * @property bool $provision_monthly
 * @property ?string $customer_space_url
 * @property string $currency
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 * @property-read Collection<int, SubscriptionAmount> $amounts
 */
#[Fillable([
    'supplier',
    'category',
    'description',
    'vat_treatment',
    'vat_rate_bp',
    'pro_share_bp',
    'periodicity',
    'debit_day',
    'debit_month',
    'started_on',
    'occurrences_from',
    'cancelled_on',
    'is_paused',
    'auto_create_expenses',
    'provision_monthly',
    'customer_space_url',
    'currency',
])]
class Subscription extends Model
{
    /** @use HasFactory<SubscriptionFactory> */
    use HasFactory;

    protected static function newFactory(): SubscriptionFactory
    {
        return SubscriptionFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'category' => ExpenseCategory::class,
            'vat_treatment' => ExpenseVatTreatment::class,
            'periodicity' => SubscriptionPeriodicity::class,
            'started_on' => CalendarDate::class,
            'occurrences_from' => CalendarDate::class,
            'cancelled_on' => CalendarDate::class,
            'is_paused' => 'boolean',
            'auto_create_expenses' => 'boolean',
            'provision_monthly' => 'boolean',
        ];
    }

    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->subscriptions(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<Expense, $this> */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /** @return HasMany<SubscriptionAmount, $this> */
    public function amounts(): HasMany
    {
        return $this->hasMany(SubscriptionAmount::class)->orderBy('effective_from');
    }

    /** Still debiting on $day: not paused, and not cancelled before it — a cancellation dated ahead keeps debiting until then. */
    public function isActiveOn(CarbonImmutable $day): bool
    {
        return ! $this->is_paused && ($this->cancelled_on === null || $this->cancelled_on->greaterThanOrEqualTo($day));
    }

    /** A next debit exists: a pause, or a cancellation with no debit left before it, leaves none. */
    public function stillDebitsAfter(CarbonImmutable $today): bool
    {
        return new OccurrenceSchedule($this)->nextDebitOn($today) instanceof CarbonImmutable;
    }

    /**
     * The first day an occurrence may be written for: the start, or the
     * later day the subscription was recorded or resumed on.
     */
    public function occurrencesFrom(): CarbonImmutable
    {
        return max($this->started_on, $this->occurrences_from ?? $this->started_on);
    }

    /**
     * The HT price in force on $date: the latest history row dated on or
     * before it — else the opening one, the only way a debit can precede
     * every row.
     */
    public function priceOn(CarbonImmutable $date): Money
    {
        $inForce = null;

        foreach ($this->amounts as $amount) {
            if ($inForce === null || $amount->effective_from->lessThanOrEqualTo($date)) {
                $inForce = $amount;
            }
        }

        if (! $inForce instanceof SubscriptionAmount) {
            throw new InvalidArgumentException('A subscription always carries at least its opening price.');
        }

        return $inForce->amount_ht_cents;
    }

    public function amountsOn(CarbonImmutable $date): ExpenseAmounts
    {
        return ExpenseAmounts::fromHt($this->priceOn($date), $this->vat_treatment, $this->vat_rate_bp);
    }

    /** A twelfth of the annual debit, while it is provisioned month by month. */
    public function monthlyProvisionOn(CarbonImmutable $date): ?Money
    {
        return $this->provision_monthly
            ? $this->amountsOn($date)->ttc->divide(12, MoneyPhp::ROUND_HALF_UP)
            : null;
    }
}
