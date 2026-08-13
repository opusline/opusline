<?php

declare(strict_types=1);

namespace App\Domain\Cra\Models;

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Factories\CraFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * A month of days worked on one mission, as reported to the client.
 *
 * @property int $id
 * @property int $user_id
 * @property int $mission_id
 * @property CarbonImmutable $month
 * @property CraStatus $status
 * @property ?CarbonImmutable $sent_on
 * @property ?CarbonImmutable $signed_on
 * @property ?string $notes
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Mission $mission
 * @property-read ?int $reported_bp Sum of the day grid, when loaded via withSum.
 */
#[Fillable([
    'mission_id',
    'month',
    'status',
    'sent_on',
    'signed_on',
    'notes',
])]
#[Table('cras')]
class Cra extends Model
{
    /** @use HasFactory<CraFactory> */
    use HasFactory;

    protected static function newFactory(): CraFactory
    {
        return CraFactory::new();
    }

    /**
     * Scope every {cra} route binding to the authenticated user, so a foreign row
     * resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->cras(),
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
            'month' => CalendarDate::class,
            'status' => CraStatus::class,
            'sent_on' => CalendarDate::class,
            'signed_on' => CalendarDate::class,
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Mission, $this> */
    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    /**
     * Ordered because the grid and the PDF both read it as a calendar.
     *
     * @return HasMany<CraDay, $this>
     */
    public function days(): HasMany
    {
        return $this->hasMany(CraDay::class)->orderBy('date');
    }

    /** Whether the day grid may still be changed. */
    public function isEditable(): bool
    {
        return ! $this->status->isIssued();
    }
}
