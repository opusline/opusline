<?php

declare(strict_types=1);

namespace App\Domain\Timers\Models;

use App\Domain\Missions\Models\Mission;
use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Factories\RunningTimerFactory;
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
 * @property CarbonImmutable $started_at
 * @property ?CarbonImmutable $running_since
 * @property int $accumulated_seconds
 * @property ?string $note
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read Mission $mission
 */
#[Fillable([
    'mission_id',
    'started_at',
    'running_since',
    'accumulated_seconds',
    'note',
])]
class RunningTimer extends Model
{
    /** @use HasFactory<RunningTimerFactory> */
    use HasFactory;

    protected static function newFactory(): RunningTimerFactory
    {
        return RunningTimerFactory::new();
    }

    public function isPaused(): bool
    {
        return ! $this->running_since instanceof CarbonImmutable;
    }

    public function state(): TimerState
    {
        return $this->isPaused() ? TimerState::Paused : TimerState::Running;
    }

    public function elapsedSeconds(?CarbonImmutable $now = null): int
    {
        if (! $this->running_since instanceof CarbonImmutable) {
            return $this->accumulated_seconds;
        }

        $now ??= CarbonImmutable::now();

        return $this->accumulated_seconds + max(0, (int) $this->running_since->diffInSeconds($now));
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
            'started_at' => 'datetime',
            'running_since' => 'datetime',
            'accumulated_seconds' => 'integer',
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
