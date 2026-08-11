<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Models\User;
use Spatie\LaravelData\Data;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public Theme $theme,
        public int $workdayMinutes,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            theme: $user->theme,
            workdayMinutes: config()->integer('app.workday_minutes'),
        );
    }
}
