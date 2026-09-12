<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $user_id
 * @property int $bank_statement_id
 * @property ?int $invoice_id
 * @property ?int $expense_id
 * @property CarbonImmutable $booked_on
 * @property string $label
 * @property Money $amount_cents
 * @property string $currency
 * @property string $dedup_hash
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 * @property-read BankStatement $statement
 * @property-read ?Invoice $invoice
 * @property-read ?Expense $expense
 * @property-read ?BankMatch $match
 */
#[Fillable([
    'bank_statement_id',
    'invoice_id',
    'expense_id',
    'booked_on',
    'label',
    'currency',
    'amount_cents',
    'dedup_hash',
])]
class BankMovement extends Model
{
    /** @use HasFactory<BankMovementFactory> */
    use HasFactory;

    protected static function newFactory(): BankMovementFactory
    {
        return BankMovementFactory::new();
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
            'booked_on' => CalendarDate::class,
            'amount_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<BankStatement, $this> */
    public function statement(): BelongsTo
    {
        return $this->belongsTo(BankStatement::class, 'bank_statement_id');
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /** @return BelongsTo<Expense, $this> */
    public function expense(): BelongsTo
    {
        return $this->belongsTo(Expense::class);
    }

    /** @return HasOne<BankMatch, $this> */
    public function match(): HasOne
    {
        return $this->hasOne(BankMatch::class);
    }

    /**
     * The debits nothing explains yet: no invoice, no expense.
     *
     * @param  Builder<BankMovement>  $query
     */
    #[Scope]
    protected function unlinkedDebits(Builder $query): void
    {
        $query->where('amount_cents', '<', 0)->whereNull('invoice_id')->whereNull('expense_id');
    }

    public function isCredit(): bool
    {
        return $this->amount_cents->isPositive();
    }
}
