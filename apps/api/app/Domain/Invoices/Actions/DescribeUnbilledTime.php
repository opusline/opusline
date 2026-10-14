<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\UnbilledTimeData;
use App\Domain\Invoices\Enums\LineUnit;
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
        $workdayMinutes = $user->settingsOrFail()->workday_minutes;
        $entries = $mission->timeEntries()
            ->where('billable', true)
            ->where(fn ($query) => $invoiceId === null
                ? $query->whereNull('invoice_id')
                : $query->whereNull('invoice_id')->orWhere('invoice_id', $invoiceId))
            ->orderBy('date')
            ->get();
        $isHourly = $mission->billing_mode === BillingMode::Hourly;
        $quantityMilli = 0;

        foreach ($entries as $entry) {
            $quantity = $this->valueTrackedTime->quantityFor($mission, $entry, $workdayMinutes);
            $quantityMilli += $isHourly
                ? intdiv(($quantity['minutes'] ?? 0) * 1000 + 30, 60)
                : (int) round(($quantity['days'] ?? 0.0) * 1000);
        }

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
}
