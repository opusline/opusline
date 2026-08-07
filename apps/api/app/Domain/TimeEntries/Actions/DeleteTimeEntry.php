<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\TimeEntries\Models\TimeEntry;

class DeleteTimeEntry
{
    public function handle(TimeEntry $timeEntry): void
    {
        $timeEntry->delete();
    }
}
