<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Invoice;
use App\Domain\TimeEntries\Models\TimeEntry;
use Illuminate\Validation\ValidationException;

/**
 * Marks tracked time as covered by an invoice.
 *
 * This is what stops billed work reappearing under "à facturer", so it is also the
 * point where a mistake would silently drop time out of the unbilled total: every
 * entry is checked, and one bad id rejects the whole set rather than linking part
 * of it.
 */
class LinkInvoiceTimeEntries
{
    /**
     * @param  list<int>  $timeEntryIds
     */
    public function handle(Invoice $invoice, array $timeEntryIds): void
    {
        $ids = array_values(array_unique($timeEntryIds));

        if ($ids === []) {
            return;
        }

        if ($invoice->mission_id === null) {
            $this->reject('link_requires_mission');
        }

        $entries = TimeEntry::query()
            ->where('user_id', $invoice->user_id)
            ->whereKey($ids)
            ->lockForUpdate()
            ->get();

        if ($entries->count() !== count($ids)) {
            $this->reject('time_entry_not_found');
        }

        foreach ($entries as $entry) {
            $this->assertCoverable($invoice, $entry);
        }

        TimeEntry::query()
            ->where('user_id', $invoice->user_id)
            ->whereKey($ids)
            ->update(['invoice_id' => $invoice->id]);
    }

    private function assertCoverable(Invoice $invoice, TimeEntry $entry): void
    {
        if ($entry->mission_id !== $invoice->mission_id) {
            $this->reject('time_entry_not_on_mission');
        }

        if (! $entry->billable) {
            $this->reject('time_entry_not_billable');
        }

        if ($entry->invoice_id !== null && $entry->invoice_id !== $invoice->id) {
            $this->reject('time_entry_already_invoiced');
        }
    }

    /**
     * @throws ValidationException
     */
    private function reject(string $key): never
    {
        throw ValidationException::withMessages(['timeEntryIds' => __('invoices.'.$key)]);
    }
}
