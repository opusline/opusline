<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Models;

use App\Domain\Passkeys\Factories\PasskeyFactory;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A WebAuthn credential registered on the account: a second factor at the
 * challenge and, being discoverable, a way to sign in without a password.
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $credential_id base64url
 * @property string $public_key COSE key, base64
 * @property int $counter
 * @property ?list<string> $transports
 * @property ?string $aaguid
 * @property bool $backup_eligible
 * @property bool $backed_up
 * @property ?CarbonImmutable $last_used_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable(['name', 'credential_id', 'public_key', 'counter', 'transports', 'aaguid', 'backup_eligible', 'backed_up', 'last_used_at'])]
#[Hidden(['public_key'])]
#[Table('passkeys')]
class Passkey extends Model
{
    /** @use HasFactory<PasskeyFactory> */
    use HasFactory;

    protected static function newFactory(): PasskeyFactory
    {
        return PasskeyFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'counter' => 'integer',
            'transports' => 'array',
            'backup_eligible' => 'boolean',
            'backed_up' => 'boolean',
            'last_used_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->passkeys(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }
}
