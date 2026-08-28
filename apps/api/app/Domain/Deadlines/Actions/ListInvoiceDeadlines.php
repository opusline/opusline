<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Data\DeadlineInvoiceData;
use App\Domain\Deadlines\Data\DeadlineItemData;
use App\Domain\Deadlines\Enums\DeadlineItemType;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

/**
 * The invoice-borne lines of the timeline: every open invoice at its due date,
 * and — once that date has passed — the relance it calls for. A paid invoice
 * carries nothing: its deadline is history, and the modal's promise («
 * disparaît dès qu'elle est encaissée ») holds for the feed too.
 */
class ListInvoiceDeadlines
{
    /**
     * @return list<DeadlineItemData>
     */
    public function handle(User $user, CarbonImmutable $today): array
    {
        $invoices = $user->invoices()
            ->where('status', InvoiceStatus::Sent)
            ->with(['client:id,name', 'mission:id,name'])
            ->withCount([
                'events as reminders_sent' => static fn (Builder $query) => $query
                    ->where('kind', InvoiceEventKind::Reminded),
            ])
            ->withMax([
                'events as last_reminded_on' => static fn (Builder $query) => $query
                    ->where('kind', InvoiceEventKind::Reminded),
            ], 'occurred_on')
            ->orderBy('due_on')
            ->get();

        $items = [];
        $todayDate = $today->toDateString();

        foreach ($invoices as $invoice) {
            $data = DeadlineInvoiceData::fromInvoice($invoice);

            $items[] = new DeadlineItemData(
                type: DeadlineItemType::InvoiceDue,
                dueOn: $data->dueOn,
                invoice: $data,
                fiscal: null,
            );

            if ($data->dueOn->toDateString() < $todayDate) {
                $items[] = new DeadlineItemData(
                    type: DeadlineItemType::InvoiceReminder,
                    dueOn: $data->dueOn,
                    invoice: $data,
                    fiscal: null,
                );
            }
        }

        return $items;
    }
}
