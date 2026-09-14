<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Models;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Expenses\Vat\ExpenseAmounts;
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
 * A purchase made for the business: what the journal lists, what the CA3
 * deducts, what the micro-BNC comparison counts as real charges.
 *
 * @property int $id
 * @property int $user_id
 * @property string $supplier
 * @property ExpenseCategory $category
 * @property ?string $description
 * @property CarbonImmutable $spent_on
 * @property ExpenseVatTreatment $vat_treatment
 * @property int $vat_rate_bp
 * @property int $pro_share_bp
 * @property Money $amount_ttc_cents
 * @property Money $amount_ht_cents
 * @property string $currency
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable([
    'supplier',
    'category',
    'description',
    'spent_on',
    'vat_treatment',
    'vat_rate_bp',
    'pro_share_bp',
    'currency',
    'amount_ttc_cents',
    'amount_ht_cents',
])]
class Expense extends Model
{
    /** @use HasFactory<ExpenseFactory> */
    use HasFactory;

    protected static function newFactory(): ExpenseFactory
    {
        return ExpenseFactory::new();
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
            'category' => ExpenseCategory::class,
            'spent_on' => CalendarDate::class,
            'vat_treatment' => ExpenseVatTreatment::class,
            'amount_ttc_cents' => MoneyIntegerCast::class.':currency',
            'amount_ht_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /**
     * Scope every {expense} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->expenses(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** The `Y-m` key of the journal this purchase is listed in. */
    public function month(): string
    {
        return $this->spent_on->format('Y-m');
    }

    public function amounts(): ExpenseAmounts
    {
        return new ExpenseAmounts(
            ht: $this->amount_ht_cents,
            ttc: $this->amount_ttc_cents,
            treatment: $this->vat_treatment,
            rateBp: $this->vat_rate_bp,
        );
    }
}
