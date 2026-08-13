<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\TimeEntries\Models\TimeEntry;

class DeleteTimeEntry
{
    public function handle(TimeEntry $timeEntry): void
    {
        abort_if($timeEntry->isInvoiced(), 409, __('invoices.cannot_delete_invoiced_time_entry'));

        $timeEntry->delete();
    }
}
