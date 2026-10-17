<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Invoices\Factories\InvoicePaymentFactory;
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
 * Money that moved on an invoice: a transfer received, or a refund going back
 * out as a negative amount. Dated the day it moved, which is the day the
 * cash-basis URSSAF and TVA declarations count it.
 *
 * @property int $id
 * @property int $user_id
 * @property int $invoice_id
 * @property Money $amount_cents
 * @property string $currency
 * @property CarbonImmutable $paid_on
 * @property ?int $bank_movement_id
 * @property ?int $credit_note_id
 * @property ?string $note
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Invoice $invoice
 * @property-read User $user
 * @property-read ?BankMovement $bankMovement
 * @property-read ?CreditNote $creditNote
 */
#[Fillable([
    'user_id',
    'currency',
    'amount_cents',
    'paid_on',
    'bank_movement_id',
    'credit_note_id',
    'note',
])]
class InvoicePayment extends Model
{
    /** @use HasFactory<InvoicePaymentFactory> */
    use HasFactory;

    protected static function newFactory(): InvoicePaymentFactory
    {
        return InvoicePaymentFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'paid_on' => CalendarDate::class,
            'amount_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * The HT this payment collected: its share of the invoice's HT, in the
     * proportion the payment is of the TTC. A payment of the whole TTC is the
     * whole HT to the cent; the rounding lands on the VAT share, never here.
     */
    public function htShare(): Money
    {
        // A refund carries the VAT mix of the credit note it settles, not the invoice's.
        $document = $this->credit_note_id === null ? $this->invoice : $this->creditNote;
        assert($document instanceof Invoice || $document instanceof CreditNote);
        $ttc = (int) $document->amount_ttc_cents->getAmount();
        $ht = (int) $document->amount_ht_cents->getAmount();
        $amount = (int) $this->amount_cents->getAmount();

        if ($ttc === 0 || abs($amount) === $ttc) {
            return new Money($amount < 0 ? -$ht : $ht, $this->currency);
        }

        return new Money((int) round($amount * $ht / $ttc), $this->currency);
    }

    /** The VAT this payment collected: what is left of it once its HT share is taken. */
    public function vatShare(): Money
    {
        return $this->amount_cents->subtract($this->htShare());
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<BankMovement, $this> */
    public function bankMovement(): BelongsTo
    {
        return $this->belongsTo(BankMovement::class);
    }

    /**
     * The credit note a refund settles; null for money the client paid.
     *
     * @return BelongsTo<CreditNote, $this>
     */
    public function creditNote(): BelongsTo
    {
        return $this->belongsTo(CreditNote::class);
    }
}
