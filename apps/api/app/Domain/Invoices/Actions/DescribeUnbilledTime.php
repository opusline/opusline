<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\UnbilledTimeData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * The time « Importer le temps saisi » turns into one invoice line: every
 * billable entry of the mission no invoice covers yet, summed in the
 * mission's unit and priced at its rate.
 *
 * The quantity is kept to the thousandth, so a line of whole and half days is
 * exact; a third of a day becomes 0,333, which can differ by a cent from the
 * entries valued one by one.
 */
class DescribeUnbilledTime
{
    public function __construct(private readonly ValueTrackedTime $valueTrackedTime) {}

    public function handle(User $user, int $missionId, ?int $invoiceId = null): UnbilledTimeData
    {
        $mission = $user->missions()->whereKey($missionId)->firstOrFail();
        $draft = $this->editableDraft($user, $invoiceId);
        $workdayMinutes = $user->settingsOrFail()->workday_minutes;
        $entries = $mission->timeEntries()
            ->where('billable', true)
            ->where(fn ($query) => $draft === null
                ? $query->whereNull('invoice_id')
                : $query->whereNull('invoice_id')->orWhere('invoice_id', $draft->id))
            ->orderBy('date')
            ->get();
        $isHourly = $mission->billing_mode === BillingMode::Hourly;
        $minutes = 0;
        $days = 0.0;

        // Each entry is rounded the way the mission says, then the sum is
        // converted once: three 20-minute entries make exactly one hour, not 0,999.
        foreach ($entries as $entry) {
            $quantity = $this->valueTrackedTime->quantityFor($mission, $entry, $workdayMinutes);
            $minutes += $quantity['minutes'] ?? 0;
            $days += $quantity['days'] ?? 0.0;
        }

        $quantityMilli = $isHourly ? intdiv($minutes * 1000 + 30, 60) : (int) round($days * 1000);
        $rate = $mission->rate_cents;

        return new UnbilledTimeData(
            missionId: $mission->id,
            missionName: $mission->name,
            timeEntryIds: array_values($entries->map(static fn (TimeEntry $entry): int => $entry->id)->all()),
            firstEntryOn: $entries->first()?->date,
            lastEntryOn: $entries->last()?->date,
            quantityMilli: $quantityMilli,
            unit: $isHourly ? LineUnit::Hour : LineUnit::Day,
            unitPrice: $this->valueTrackedTime->pricesTime($mission) && $rate instanceof Money ? MoneyData::fromMoney($rate) : null,
        );
    }

    /** The draft being edited: the account's own, and still a draft, like the save that will follow. */
    private function editableDraft(User $user, ?int $invoiceId): ?Invoice
    {
        if ($invoiceId === null) {
            return null;
        }

        $invoice = $user->invoices()->whereKey($invoiceId)->firstOrFail();

        abort_if(
            ! $invoice->isWrittenInOpusline() || $invoice->status !== InvoiceStatus::Draft,
            409,
            __('invoices.not_an_opusline_draft'),
        );

        return $invoice;
    }
}
