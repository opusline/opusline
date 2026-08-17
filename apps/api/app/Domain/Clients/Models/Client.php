<?php

declare(strict_types=1);

namespace App\Domain\Clients\Models;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Enums\VatTreatment;
use App\Domain\Clients\Factories\ClientFactory;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $slug
 * @property ClientType $type
 * @property ?string $notes
 * @property ?string $siret
 * @property ?string $vat_number
 * @property VatTreatment $vat_treatment
 * @property ?string $billing_address_line1
 * @property ?string $billing_address_line2
 * @property ?string $billing_postal_code
 * @property ?string $billing_city
 * @property ?string $billing_country
 * @property ?string $billing_contact_name
 * @property ?string $billing_email
 * @property Color $color
 * @property int $payment_terms_days
 * @property ?CarbonImmutable $archived_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Fillable([
    'name',
    'type',
    'notes',
    'siret',
    'vat_number',
    'vat_treatment',
    'billing_address_line1',
    'billing_address_line2',
    'billing_postal_code',
    'billing_city',
    'billing_country',
    'billing_contact_name',
    'billing_email',
    'color',
    'payment_terms_days',
    'archived_at',
])]
class Client extends Model implements HasMedia
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    use HasSlug;
    use InteractsWithMedia;

    protected static function newFactory(): ClientFactory
    {
        return ClientFactory::new();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')->singleFile();
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
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'type' => ClientType::class,
            'vat_treatment' => VatTreatment::class,
            'color' => Color::class,
            'payment_terms_days' => 'integer',
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
        return $this->hasMany(Mission::class)->orderBy('name');
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    #[\Override]
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Scope every {client} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->clients(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }
}
