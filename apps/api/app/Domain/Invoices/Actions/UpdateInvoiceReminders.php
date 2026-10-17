<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\UpdateInvoiceRemindersData;
use App\Domain\Invoices\Models\Invoice;

class UpdateInvoiceReminders
{
    public function __construct(private readonly LockInvoice $lockInvoice) {}

    public function handle(Invoice $invoice, UpdateInvoiceRemindersData $data): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($data): Invoice {
            abort_if(! $locked->status->canBeReminded(), 409, __('invoices.cannot_remind'));

            $locked->update([
                'reminders_enabled' => $data->enabled,
                'reminders_frequency' => $data->frequency,
            ]);

            return $locked;
        });
    }
}
