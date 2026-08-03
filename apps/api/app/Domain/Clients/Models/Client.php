<?php

declare(strict_types=1);

namespace App\Domain\Clients\Models;

use App\Domain\Clients\Factories\ClientFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $slug
 * @property ?string $notes
 * @property ?CarbonImmutable $archived_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Fillable(['name', 'notes', 'archived_at'])]
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    use HasSlug;

    protected static function newFactory(): ClientFactory
    {
        return ClientFactory::new();
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
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'archived_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Mission, $this>
     */
    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }

    /**
     * @throws ModelNotFoundException
     */
    public function missionById(int $missionId): Mission
    {
        return $this->missions()->findOrFail($missionId);
    }
}
