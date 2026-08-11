<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Models;

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\TimeEntries\Factories\TimeEntryFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $mission_id
 * @property CarbonImmutable $date
 * @property int $duration_minutes
 * @property ?EntryRounding $rounding
 * @property bool $billable
 * @property ?string $note
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Mission $mission
 */
#[Fillable([
    'mission_id',
    'date',
    'duration_minutes',
    'rounding',
    'billable',
    'note',
])]
class TimeEntry extends Model
{
    public const int MINUTES_PER_DAY = 1440;

    /** @use HasFactory<TimeEntryFactory> */
    use HasFactory;

    protected static function newFactory(): TimeEntryFactory
    {
        return TimeEntryFactory::new();
    }

    /**
     * Scope every {timeEntry} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->timeEntries(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /**
     * The duration as it would be billed, rounded up to the mission's
     * increment. Null when the mission is billed by the day.
     */
    public function valuedMinutes(): ?int
    {
        if ($this->mission->billing_mode->usesDayFraction()) {
            return null;
        }

        return $this->effectiveRounding()->valueMinutes($this->duration_minutes);
    }

    /**
     * The duration as a fraction of a workday, rounded up to the mission's
     * increment. Null when the mission is billed by the hour.
     */
    public function valuedDayFraction(): ?float
    {
        if (! $this->mission->billing_mode->usesDayFraction()) {
            return null;
        }

        return $this->effectiveRounding()->valueDayFraction(
            $this->duration_minutes,
            config()->integer('app.workday_minutes'),
        );
    }

    public function effectiveRounding(): EntryRounding
    {
        return $this->rounding ?? $this->mission->effectiveRounding();
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
            'date' => CalendarDate::class,
            'duration_minutes' => 'integer',
            'rounding' => EntryRounding::class,
            'billable' => 'boolean',
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
}
