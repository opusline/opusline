<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\UpdateUserThemeData;
use App\Domain\Users\Models\User;

class UpdateUserTheme
{
    public function handle(User $user, UpdateUserThemeData $data): User
    {
        $user->theme = $data->theme;
        $user->save();

        return $user;
    }
}
