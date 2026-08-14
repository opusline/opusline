<?php

declare(strict_types=1);

namespace App\Domain\Missions\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Models\Cra;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Shared\Enums\Color;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property int $client_id
 * @property string $name
 * @property string $slug
 * @property ?string $end_client_name
 * @property BillingMode $billing_mode
 * @property ?Money $rate_cents
 * @property string $currency
 * @property ?EntryRounding $rounding
 * @property MissionStatus $status
 * @property bool $cra_required
 * @property ?Color $color
 * @property ?string $notes
 * @property ?CarbonImmutable $start_date
 * @property ?CarbonImmutable $end_date
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Client $client
 * @property-read User $user
 */
#[Fillable([
    'client_id',
    'name',
    'end_client_name',
    'billing_mode',
    'rate_cents',
    'currency',
    'rounding',
    'status',
    'cra_required',
    'color',
    'notes',
    'start_date',
    'end_date',
])]
class Mission extends Model implements HasMedia
{
    /** @use HasFactory<MissionFactory> */
    use HasFactory;

    use HasSlug;
    use InteractsWithMedia;

    protected static function newFactory(): MissionFactory
    {
        return MissionFactory::new();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('documents');
    }

    #[\Override]
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Scope every {mission} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->missions(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate()
            ->extraScope(
                /** @param Builder<self> $builder @return Builder<self> */
                fn (Builder $builder): Builder => $builder->where('user_id', $this->user_id),
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
            'billing_mode' => BillingMode::class,
            'rounding' => EntryRounding::class,
            'status' => MissionStatus::class,
            'cra_required' => 'boolean',
            'color' => Color::class,
            'rate_cents' => MoneyIntegerCast::class.':currency',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The contractual/billing client (ESN or direct).
     *
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return HasMany<TimeEntry, $this> */
    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /** @return HasMany<Cra, $this> */
    public function cras(): HasMany
    {
        return $this->hasMany(Cra::class);
    }

    /** @return HasOne<RunningTimer, $this> */
    public function runningTimer(): HasOne
    {
        return $this->hasOne(RunningTimer::class);
    }

    public function effectiveRounding(): EntryRounding
    {
        return $this->rounding ?? EntryRounding::Quarter;
    }

    public function effectiveColor(): Color
    {
        return $this->color ?? $this->client->color;
    }

    /**
     * Who a document about this mission is addressed to: the end client when the work
     * runs through an ESN, the billing client otherwise.
     */
    public function recipientName(): string
    {
        return $this->end_client_name ?? $this->client->name;
    }

    /**
     * The rate to multiply a number of days by, or null when days are not what this
     * mission bills. Fixed-price and hourly missions both have a rate that means
     * something else entirely.
     */
    public function dailyRate(): ?Money
    {
        return $this->billing_mode === BillingMode::Daily ? $this->rate_cents : null;
    }
}
