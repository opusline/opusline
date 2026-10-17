<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A credit note (« avoir »): the document that corrects an issued invoice,
 * which French rules forbid editing or deleting. Issued straight away and
 * never deleted; its amounts are positive and read as taken off the invoice.
 *
 * @property int $id
 * @property int $user_id
 * @property int $invoice_id
 * @property int $client_id
 * @property string $number
 * @property CreditNoteStatus $status
 * @property CreditNoteKind $kind
 * @property CreditNoteReason $reason
 * @property ?string $detail
 * @property CreditNoteSettlement $settlement
 * @property DocumentLanguage $language
 * @property CarbonImmutable $issued_on
 * @property ?CarbonImmutable $settled_on
 * @property ?int $deduction_invoice_id The later invoice that deducts it, once a draft claims it.
 * @property array<string, mixed> $seller_snapshot
 * @property array<string, mixed> $buyer_snapshot
 * @property string $currency
 * @property Money $amount_ht_cents
 * @property Money $amount_ttc_cents
 * @property int $vat_rate_bp
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Invoice $invoice
 * @property-read Client $client
 * @property-read User $user
 * @property-read Collection<int, CreditNoteLine> $lines
 */
#[Fillable([
    'invoice_id',
    'client_id',
    'number',
    'status',
    'kind',
    'reason',
    'detail',
    'settlement',
    'language',
    'issued_on',
    'settled_on',
    'deduction_invoice_id',
    'seller_snapshot',
    'buyer_snapshot',
    'currency',
    'amount_ht_cents',
    'amount_ttc_cents',
    'vat_rate_bp',
])]
class CreditNote extends Model
{
    /** The filed PDF is a document of the client's, told apart from the invoices' by this property. */
    public const string DOCUMENT_CREDIT_NOTE_PROPERTY = 'creditNoteId';

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'status' => CreditNoteStatus::class,
            'kind' => CreditNoteKind::class,
            'reason' => CreditNoteReason::class,
            'settlement' => CreditNoteSettlement::class,
            'language' => DocumentLanguage::class,
            'issued_on' => CalendarDate::class,
            'settled_on' => CalendarDate::class,
            'seller_snapshot' => 'array',
            'buyer_snapshot' => 'array',
            'amount_ht_cents' => MoneyIntegerCast::class.':currency',
            'amount_ttc_cents' => MoneyIntegerCast::class.':currency',
            'vat_rate_bp' => 'integer',
        ];
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    /** @return BelongsTo<Invoice, $this> */
    public function deductionInvoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'deduction_invoice_id');
    }

    /**
     * What the client is owed back under it: the overpayment on its invoice,
     * which the credit note may exceed when part of the invoice was unpaid.
     */
    public function owedBack(): Money
    {
        $balance = $this->invoice->balanceDue();

        return $balance->isNegative() ? $balance->absolute() : new Money(0, $this->currency);
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<CreditNoteLine, $this> */
    public function lines(): HasMany
    {
        return $this->hasMany(CreditNoteLine::class)->orderBy('position');
    }

    /**
     * @return array<string, int>
     */
    public function documentProperties(): array
    {
        return [self::DOCUMENT_CREDIT_NOTE_PROPERTY => $this->id];
    }

    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->creditNotes(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }
}
