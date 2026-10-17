<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\ComputeInvoiceAmounts;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Invoices\Lifecycle\Invoice\InvoiceLifecycle;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Concerns\ResolvesAccountSettings;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property int $user_id
 * @property int $client_id
 * @property ?int $mission_id
 * @property ?int $quote_id
 * @property ?QuoteBilling $quote_billing
 * @property ?string $number
 * @property InvoiceStatus $status
 * @property-read InvoiceLifecycle $lifecycle
 * @property InvoiceSource $source
 * @property ?string $title
 * @property ?string $description
 * @property ?DocumentLanguage $language
 * @property ?int $payment_terms_days
 * @property bool $payment_terms_end_of_month
 * @property ?int $late_penalty_rate_bp
 * @property bool $show_iban
 * @property bool $show_email
 * @property ?string $custom_mentions
 * @property ?OperationCategory $operation_category
 * @property bool $vat_on_debits
 * @property ?array<string, mixed> $seller_snapshot
 * @property ?array<string, mixed> $buyer_snapshot
 * @property CarbonImmutable $issued_on
 * @property CarbonImmutable $due_on
 * @property ?CarbonImmutable $period_start
 * @property ?CarbonImmutable $period_end
 * @property Money $amount_ht_cents
 * @property Money $amount_ttc_cents
 * @property int $vat_rate_bp
 * @property string $currency
 * @property ?string $notes
 * @property bool $reminders_enabled
 * @property ReminderFrequency $reminders_frequency
 * @property ?list<string> $reminder_recipients
 * @property-read Collection<int, DocumentEmail> $emails
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Client $client
 * @property-read User $user
 * @property-read ?Mission $mission
 * @property-read ?Quote $quote
 * @property-read Collection<int, InvoiceLine> $lines
 * @property-read Collection<int, InvoicePayment> $payments
 * @property-read ?int $paid_cents Sum of the payments, when loaded via withPaymentFigures.
 * @property-read ?string $last_paid_on Day of the last payment, when loaded via withPaymentFigures.
 */
#[Fillable([
    'client_id',
    'mission_id',
    'quote_id',
    'quote_billing',
    'number',
    'status',
    'source',
    'title',
    'description',
    'language',
    'payment_terms_days',
    'payment_terms_end_of_month',
    'late_penalty_rate_bp',
    'show_iban',
    'show_email',
    'custom_mentions',
    'operation_category',
    'vat_on_debits',
    'seller_snapshot',
    'buyer_snapshot',
    'issued_on',
    'due_on',
    'period_start',
    'period_end',
    'currency',
    'amount_ht_cents',
    'amount_ttc_cents',
    'vat_rate_bp',
    'notes',
    'reminders_enabled',
    'reminders_frequency',
    'reminder_recipients',
])]
class Invoice extends Model
{
    /**
     * An invoice's own document is filed on its client, next to everything else that
     * client sends or receives, so the document library finds it without knowing what
     * an invoice is. The property is what tells the client's pile which file belongs
     * to which invoice.
     */
    public const string DOCUMENT_INVOICE_PROPERTY = 'invoiceId';

    /** @use HasFactory<InvoiceFactory> */
    use HasFactory;

    use ResolvesAccountSettings;

    /**
     * The database defaults, mirrored so a freshly created invoice carries them
     * before it is ever re-read.
     *
     * @var array<string, mixed>
     */
    #[\Override]
    protected $attributes = [
        'reminders_enabled' => false,
        'reminders_frequency' => 0,
        'source' => InvoiceSource::External->value,
        'payment_terms_end_of_month' => false,
        'show_iban' => false,
        'show_email' => false,
        'vat_on_debits' => false,
    ];

    protected static function newFactory(): InvoiceFactory
    {
        return InvoiceFactory::new();
    }

    /**
     * Scope every {invoice} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->invoices(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
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
            'status' => InvoiceStatus::class,
            'lifecycle' => InvoiceLifecycle::class.':status',
            'source' => InvoiceSource::class,
            'quote_billing' => QuoteBilling::class,
            'language' => DocumentLanguage::class,
            'payment_terms_days' => 'integer',
            'payment_terms_end_of_month' => 'boolean',
            'late_penalty_rate_bp' => 'integer',
            'show_iban' => 'boolean',
            'show_email' => 'boolean',
            'operation_category' => OperationCategory::class,
            'vat_on_debits' => 'boolean',
            'seller_snapshot' => 'array',
            'buyer_snapshot' => 'array',
            'issued_on' => CalendarDate::class,
            'due_on' => CalendarDate::class,
            'period_start' => CalendarDate::class,
            'period_end' => CalendarDate::class,
            'amount_ht_cents' => MoneyIntegerCast::class.':currency',
            'amount_ttc_cents' => MoneyIntegerCast::class.':currency',
            'vat_rate_bp' => 'integer',
            'reminders_enabled' => 'boolean',
            'reminders_frequency' => ReminderFrequency::class,
            'reminder_recipients' => 'array',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The mission this invoice bills, when it bills exactly one. Null for a
     * one-off or for anything spanning several missions of the same client.
     *
     * @return BelongsTo<Mission, $this>
     */
    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    /**
     * The quote this invoice bills a part of, when it came from one.
     *
     * @return BelongsTo<Quote, $this>
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Ordered: this is a timeline, and the drawer renders it in the order it arrives.
     * The id break keeps same-day events (created and sent on a back-filled invoice)
     * in the order they were recorded.
     *
     * @return HasMany<InvoiceEvent, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(InvoiceEvent::class)
            ->orderBy('occurred_on')
            ->orderBy('id');
    }

    /** @return HasMany<InvoiceLine, $this> */
    public function lines(): HasMany
    {
        return $this->hasMany(InvoiceLine::class)->orderBy('position');
    }

    /** Written in Opusline from its lines, rather than recorded from another tool. */
    public function isWrittenInOpusline(): bool
    {
        return $this->source === InvoiceSource::Opusline;
    }

    /**
     * The custom properties the document filed for this invoice carries.
     *
     * @return array<string, int>
     */
    public function documentProperties(): array
    {
        return [self::DOCUMENT_INVOICE_PROPERTY => $this->id];
    }

    /**
     * The invoice's own document, as a relation on the client's pile.
     *
     * Matched on the invoice id alone, not on the category too: the client's Documents
     * tab lets a category be corrected, and that must not lose the invoice its file.
     *
     * @return MorphMany<Media, Client>
     */
    public function document(): MorphMany
    {
        return $this->client
            ->media()
            ->where('collection_name', Client::DOCUMENT_COLLECTION)
            ->where('custom_properties->'.self::DOCUMENT_INVOICE_PROPERTY, $this->id);
    }

    /** The one document filed for this invoice, or null while it carries none. */
    public function attachedDocument(): ?Media
    {
        $this->loadMissing('client');

        return $this->document()->first();
    }

    /** @return HasMany<DocumentEmail, $this> */
    public function emails(): HasMany
    {
        return $this->hasMany(DocumentEmail::class)->orderBy('sent_at')->orderBy('id');
    }

    /** @return HasMany<TimeEntry, $this> */
    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    /** @return HasMany<InvoicePayment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(InvoicePayment::class)->orderBy('paid_on')->orderBy('id');
    }

    /**
     * The two payment figures a screen reads on every row, computed by the
     * database once per query instead of once per invoice: what landed, and
     * the day the last of it did.
     *
     * @param  Builder<Invoice>  $query
     */
    public function scopeWithPaymentFigures(Builder $query): void
    {
        $query
            ->withSum('payments as paid_cents', 'amount_cents')
            ->withMax('payments as last_paid_on', 'paid_on');
    }

    /** What the client has paid so far; reads the query's figure when it carries one. */
    public function paidAmount(): Money
    {
        $cents = $this->paid_cents ?? (int) $this->payments()->sum('amount_cents');

        return new Money((int) $cents, $this->currency);
    }

    public function balanceDue(): Money
    {
        return $this->amount_ttc_cents->subtract($this->paidAmount());
    }

    /** The day the payment that completed the invoice landed; null until it is paid. */
    public function paidOn(): ?CarbonImmutable
    {
        if ($this->status !== InvoiceStatus::Paid) {
            return null;
        }

        $lastPaidOn = $this->last_paid_on ?? $this->payments()->max('paid_on');

        return is_string($lastPaidOn) ? CarbonImmutable::parse($lastPaidOn) : null;
    }

    public function vatAmount(): Money
    {
        return $this->amount_ttc_cents->subtract($this->amount_ht_cents);
    }

    /**
     * Whether the gross amount is the issuer's rather than ours. Billing tools round
     * per-line where we round per-total, so a tracked invoice may legitimately differ
     * by a cent — a client doing a full-replace PUT reads this to know it must resend
     * the amount instead of letting it be recomputed.
     */
    public function isTtcOverridden(): bool
    {
        // Opusline computes its own totals from the lines, per rate: nothing to override.
        if ($this->isWrittenInOpusline()) {
            return false;
        }

        return ! $this->amount_ttc_cents->equals(
            (new ComputeInvoiceAmounts)->ttcFor($this->amount_ht_cents, $this->vat_rate_bp),
        );
    }

    /**
     * Lateness is derived rather than stored — a status column would need a cron
     * to stay true, and would be wrong for every invoice between two runs.
     */
    public function isLate(): bool
    {
        return $this->status === InvoiceStatus::Sent
            && $this->due_on->isBefore($this->accountSettings()->today());
    }
}
