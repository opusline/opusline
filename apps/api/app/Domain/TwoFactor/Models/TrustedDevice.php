<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Models;

use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\TwoFactor\Factories\TrustedDeviceFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A browser that answered the two-factor challenge and asked to be remembered.
 *
 * @property int $id
 * @property int $user_id
 * @property string $token_hash
 * @property ?string $user_agent
 * @property ?string $ip
 * @property ?CarbonImmutable $last_used_at
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable(['token_hash', 'user_agent', 'ip', 'last_used_at', 'expires_at'])]
#[Hidden(['token_hash'])]
#[Table('trusted_devices')]
class TrustedDevice extends Model
{
    /** @use HasFactory<TrustedDeviceFactory> */
    use HasFactory;

    use Prunable;

    public const int LIFETIME_DAYS = 30;

    protected static function newFactory(): TrustedDeviceFactory
    {
        return TrustedDeviceFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'last_used_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public static function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return Builder<static>
     */
    public function prunable(): Builder
    {
        return static::query()->where('expires_at', '<', now());
    }

    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->trustedDevices(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }
}
