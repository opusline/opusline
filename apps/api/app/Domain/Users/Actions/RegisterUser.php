<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\RegisterUserData;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class RegisterUser
{
    public function handle(RegisterUserData $data): User
    {
        return DB::transaction(function () use ($data): User {
            $user = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => $data->password,
            ]);

            $user->settings()->create();

            return $user;
        });
    }
}
