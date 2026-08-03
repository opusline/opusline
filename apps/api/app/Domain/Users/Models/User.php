<?php

declare(strict_types=1);

namespace App\Domain\Users\Models;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    use Notifiable;

    protected static function newFactory(): UserFactory
    {
        return UserFactory::new();
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
        ];
    }

    /** @return HasMany<Client, $this> */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    /**
     * @throws ModelNotFoundException
     */
    public function clientById(int $clientId): Client
    {
        return $this->clients()->findOrFail($clientId);
    }

    /** @return HasMany<Mission, $this> */
    public function missions(): HasMany
    {
        return $this->hasMany(Mission::class);
    }
}
