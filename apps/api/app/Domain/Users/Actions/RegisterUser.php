<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Settings\Enums\Locale;
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
                'release_notes_seen_version' => config()->string('app.version'),
            ]);

            $user->settings()->create([
                'locale' => Locale::fromLanguageTag(app()->getLocale()),
            ]);

            return $user;
        });
    }
}
