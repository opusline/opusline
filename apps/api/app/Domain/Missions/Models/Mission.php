<?php

declare(strict_types=1);

namespace App\Domain\Missions\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property int $client_id
 * @property ?int $end_client_id
 * @property string $name
 * @property string $slug
 * @property BillingMode $billing_mode
 * @property ?Money $rate_cents
 * @property string $currency
 * @property MissionStatus $status
 * @property ?CarbonImmutable $start_date
 * @property ?CarbonImmutable $end_date
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Client $client
 * @property-read ?Client $endClient
 */
#[Fillable([
    'client_id',
    'end_client_id',
    'name',
    'billing_mode',
    'rate_cents',
    'currency',
    'status',
    'start_date',
    'end_date',
])]
class Mission extends Model
{
    /** @use HasFactory<MissionFactory> */
    use HasFactory;

    use HasSlug;

    protected static function newFactory(): MissionFactory
    {
        return MissionFactory::new();
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
            'status' => MissionStatus::class,
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

    /**
     * The end client when billing goes through an intermediary.
     *
     * @return BelongsTo<Client, $this>
     */
    public function endClient(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'end_client_id');
    }
}
