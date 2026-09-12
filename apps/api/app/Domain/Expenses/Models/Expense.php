<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Models;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
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
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * A purchase made for the business: what the journal lists, what the CA3
 * deducts, what the micro-BNC comparison counts as real charges.
 *
 * The receipt is a single-file media collection: the fisc wants one
 * justificatif per purchase, and without it the TVA is not deductible.
 *
 * @property int $id
 * @property int $user_id
 * @property string $supplier
 * @property ExpenseCategory $category
 * @property ?string $description
 * @property CarbonImmutable $spent_on
 * @property string $vat_claim_period
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
    'vat_claim_period',
    'vat_treatment',
    'vat_rate_bp',
    'pro_share_bp',
    'currency',
    'amount_ttc_cents',
    'amount_ht_cents',
])]
class Expense extends Model implements HasMedia
{
    /** @use HasFactory<ExpenseFactory> */
    use HasFactory;

    use InteractsWithMedia;

    public const string RECEIPT_COLLECTION = 'receipt';

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

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection(self::RECEIPT_COLLECTION)->singleFile();
    }

    public function receipt(): ?Media
    {
        return $this->getFirstMedia(self::RECEIPT_COLLECTION);
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

    /** Whether the claim landed on a later month than the purchase, by hand or because its own was declared. */
    public function isDeferred(): bool
    {
        return $this->vat_claim_period !== $this->month();
    }

    /**
     * Whether the receipt carries TVA the account may recover: a French
     * supplier's rate on it. Reverse charge nets to nothing, exemption and an
     * untracked 0 % carry none.
     */
    public function hasDeductibleVat(): bool
    {
        return $this->vat_treatment === ExpenseVatTreatment::Domestic && $this->vat_rate_bp > 0;
    }

    /** @param  ?DeclaredCa3Months  $declared  null for an account that files no CA3 */
    public function vatStatus(?DeclaredCa3Months $declared): ExpenseVatStatus
    {
        if (! $declared instanceof DeclaredCa3Months) {
            return ExpenseVatStatus::NotApplicable;
        }

        if ($this->vat_treatment->isReverseCharge()) {
            return ExpenseVatStatus::ReverseCharged;
        }

        if (! $this->hasDeductibleVat()) {
            return ExpenseVatStatus::NotApplicable;
        }

        if (! $this->receipt() instanceof Media) {
            return ExpenseVatStatus::Blocked;
        }

        if ($this->isDeferred()) {
            return ExpenseVatStatus::Deferred;
        }

        return $declared->isDeclared($this->vat_claim_period) ? ExpenseVatStatus::Deducted : ExpenseVatStatus::Deductible;
    }

    /** The purchase month was declared without this row: the CA3 lists it as « autre TVA à déduire » (case 21). */
    public function isRegularisation(?DeclaredCa3Months $declared): bool
    {
        return $declared instanceof DeclaredCa3Months && $declared->isRegularisation($this->month(), $this->vat_claim_period);
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
