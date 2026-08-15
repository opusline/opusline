<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Models\User;

class MarkReleaseNotesSeen
{
    public function handle(User $user): User
    {
        $user->release_notes_seen_version = config()->string('app.version');
        $user->save();

        return $user;
    }
}
