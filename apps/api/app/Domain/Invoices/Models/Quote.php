<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Factories\QuoteFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Concerns\ResolvesAccountSettings;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
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
 * @property ?string $number
 * @property QuoteStatus $status
 * @property InvoiceSource $source
 * @property ?string $title
 * @property ?string $description
 * @property ?DocumentLanguage $language
 * @property CarbonImmutable $issued_on
 * @property int $validity_days
 * @property CarbonImmutable $valid_until
 * @property ?int $deposit_rate_bp
 * @property int $payment_terms_days
 * @property bool $payment_terms_end_of_month
 * @property bool $show_email
 * @property ?string $custom_mentions
 * @property ?array<string, mixed> $seller_snapshot
 * @property ?array<string, mixed> $buyer_snapshot
 * @property ?CarbonImmutable $accepted_on
 * @property ?CarbonImmutable $refused_on
 * @property string $currency
 * @property Money $amount_ht_cents
 * @property Money $amount_ttc_cents
 * @property int $vat_rate_bp
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Client $client
 * @property-read User $user
 * @property-read ?Mission $mission
 * @property-read Collection<int, QuoteLine> $lines
 * @property-read Collection<int, Invoice> $invoices
 */
#[Fillable([
    'client_id',
    'mission_id',
    'number',
    'status',
    'source',
    'title',
    'description',
    'language',
    'issued_on',
    'validity_days',
    'valid_until',
    'deposit_rate_bp',
    'payment_terms_days',
    'payment_terms_end_of_month',
    'show_email',
    'custom_mentions',
    'seller_snapshot',
    'buyer_snapshot',
    'accepted_on',
    'refused_on',
    'currency',
    'amount_ht_cents',
    'amount_ttc_cents',
    'vat_rate_bp',
])]
class Quote extends Model
{
    /** The property that tells the client's document pile which file is this quote's. */
    public const string DOCUMENT_QUOTE_PROPERTY = 'quoteId';

    /** @use HasFactory<QuoteFactory> */
    use HasFactory;

    use ResolvesAccountSettings;

    /** @var array<string, mixed> */
    #[\Override]
    protected $attributes = [
        'source' => InvoiceSource::Opusline->value,
        'payment_terms_end_of_month' => false,
        'show_email' => false,
    ];

    protected static function newFactory(): QuoteFactory
    {
        return QuoteFactory::new();
    }

    /**
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->quotes(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'status' => QuoteStatus::class,
            'source' => InvoiceSource::class,
            'language' => DocumentLanguage::class,
            'issued_on' => CalendarDate::class,
            'validity_days' => 'integer',
            'valid_until' => CalendarDate::class,
            'deposit_rate_bp' => 'integer',
            'payment_terms_days' => 'integer',
            'payment_terms_end_of_month' => 'boolean',
            'show_email' => 'boolean',
            'seller_snapshot' => 'array',
            'buyer_snapshot' => 'array',
            'accepted_on' => CalendarDate::class,
            'refused_on' => CalendarDate::class,
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

    /** @return BelongsTo<Mission, $this> */
    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    /** @return HasMany<QuoteLine, $this> */
    public function lines(): HasMany
    {
        return $this->hasMany(QuoteLine::class)->orderBy('position');
    }

    /**
     * The invoices built from this quote, oldest first: the deposit before the balance.
     *
     * @return HasMany<Invoice, $this>
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class)->orderBy('id');
    }

    /**
     * The quote's own PDF, filed on the client's pile when it was validated.
     *
     * @return MorphMany<Media, Client>
     */
    public function document(): MorphMany
    {
        return $this->client
            ->media()
            ->where('collection_name', Client::DOCUMENT_COLLECTION)
            ->where('custom_properties->'.self::DOCUMENT_QUOTE_PROPERTY, $this->id);
    }

    public function attachedDocument(): ?Media
    {
        $this->loadMissing('client');

        return $this->document()->first();
    }

    /** @return array<string, int> */
    public function documentProperties(): array
    {
        return [self::DOCUMENT_QUOTE_PROPERTY => $this->id];
    }

    /** Written in Opusline from its lines, rather than recorded from another tool. */
    public function isWrittenInOpusline(): bool
    {
        return $this->source === InvoiceSource::Opusline;
    }

    public function vatAmount(): Money
    {
        return $this->amount_ttc_cents->subtract($this->amount_ht_cents);
    }

    /** Sent, undecided, and past its validity: the offer lapsed on its own. */
    public function isExpired(): bool
    {
        return $this->status === QuoteStatus::Sent
            && $this->valid_until->isBefore($this->accountSettings()->today());
    }
}
