<?php

declare(strict_types=1);

namespace App\Domain\Missions\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
}
