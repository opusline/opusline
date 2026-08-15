<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\UpdateReleaseNotesSeenData;
use App\Domain\Users\Models\User;

class MarkReleaseNotesSeen
{
    public function handle(User $user, UpdateReleaseNotesSeenData $data): User
    {
        $current = $user->release_notes_seen_version;

        if ($current === null || version_compare($data->version, $current, '>')) {
            $user->release_notes_seen_version = $data->version;
            $user->save();
        }

        return $user;
    }
}
