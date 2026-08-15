<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\UpdateReleaseNotesSeenData;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class MarkReleaseNotesSeen
{
    public function handle(User $user, UpdateReleaseNotesSeenData $data): User
    {
        return DB::transaction(function () use ($user, $data): User {
            $lockedUser = User::lockRow($user->id);
            $current = $lockedUser->release_notes_seen_version;

            if ($current === null || version_compare($data->version, $current, '>')) {
                $lockedUser->release_notes_seen_version = $data->version;
                $lockedUser->save();
            }

            return $lockedUser;
        });
    }
}
