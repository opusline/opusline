<?php

declare(strict_types=1);

namespace App\Domain\Users\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Factories\UserFactory;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property ?CarbonImmutable $email_verified_at
 * @property string $password
 * @property Theme $theme
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use InteractsWithMedia;
    use Notifiable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'theme' => Theme::System->value,
    ];

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('signature')->singleFile();
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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'theme' => Theme::class,
        ];
    }

    /** @return HasMany<Client, $this> */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    /** @return HasMany<Mission, $this> */
    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }

    /** @return HasMany<TimeEntry, $this> */
    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    /** @return HasOne<RunningTimer, $this> */
    public function runningTimer(): HasOne
    {
        return $this->hasOne(RunningTimer::class);
    }

    /** @return HasOne<UserSettings, $this> */
    public function settings(): HasOne
    {
        return $this->hasOne(UserSettings::class);
    }
}
