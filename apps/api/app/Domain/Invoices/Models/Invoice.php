<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\ComputeInvoiceAmounts;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Factories\InvoiceFactory;
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
 * @property ?string $number
 * @property InvoiceStatus $status
 * @property CarbonImmutable $issued_on
 * @property CarbonImmutable $due_on
 * @property ?CarbonImmutable $paid_on
 * @property ?CarbonImmutable $period_start
 * @property ?CarbonImmutable $period_end
 * @property Money $amount_ht_cents
 * @property Money $amount_ttc_cents
 * @property int $vat_rate_bp
 * @property string $currency
 * @property ?string $notes
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Client $client
 * @property-read User $user
 * @property-read ?Mission $mission
 */
#[Fillable([
    'client_id',
    'mission_id',
    'number',
    'status',
    'issued_on',
    'due_on',
    'paid_on',
    'period_start',
    'period_end',
    'currency',
    'amount_ht_cents',
    'amount_ttc_cents',
    'vat_rate_bp',
    'notes',
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
            'issued_on' => CalendarDate::class,
            'due_on' => CalendarDate::class,
            'paid_on' => CalendarDate::class,
            'period_start' => CalendarDate::class,
            'period_end' => CalendarDate::class,
            'amount_ht_cents' => MoneyIntegerCast::class.':currency',
            'amount_ttc_cents' => MoneyIntegerCast::class.':currency',
            'vat_rate_bp' => 'integer',
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

    /** @return HasMany<TimeEntry, $this> */
    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
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
