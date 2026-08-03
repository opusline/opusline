<?php

declare(strict_types=1);

namespace App\Domain\Missions\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $client_id
 * @property ?int $end_client_id
 * @property string $name
 * @property BillingMode $billing_mode
 * @property ?int $rate_cents
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

    protected static function newFactory(): MissionFactory
    {
        return MissionFactory::new();
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
            'rate_cents' => 'integer',
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
