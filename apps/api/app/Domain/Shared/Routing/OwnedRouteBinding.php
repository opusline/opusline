<?php

declare(strict_types=1);

namespace App\Domain\Shared\Routing;

use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

final class OwnedRouteBinding
{
    /**
     * @template TModel of Model
     *
     * @param  HasMany<TModel, User>|MorphMany<TModel, User>|null  $owned  the caller's rows for the authenticated user
     */
    public static function resolve(HasMany|MorphMany|null $owned, string $field, mixed $value): ?Model
    {
        return $owned?->where($field, $value)->first();
    }
}
