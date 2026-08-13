<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\ComputeInvoiceAmounts;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Casts\CalendarDate;
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
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory;

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
            new ComputeInvoiceAmounts()->ttcFor($this->amount_ht_cents, $this->vat_rate_bp),
        );
    }

    /**
     * Lateness is derived rather than stored — a status column would need a cron
     * to stay true, and would be wrong for every invoice between two runs.
     */
    public function isLate(): bool
    {
        return $this->status === InvoiceStatus::Sent
            && $this->due_on->isBefore(CarbonImmutable::today());
    }
}
