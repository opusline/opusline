<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Cra\Data\CraData;
use App\Domain\Cra\Data\CraDayData;
use App\Domain\Cra\Models\Cra;
use App\Domain\Cra\Models\CraDay;
use App\Domain\Shared\Data\MoneyData;
use Cknow\Money\Money;
use Money\Money as MoneyPhp;

/**
 * A CRA as the screen and the PDF need it: every calendar day of the month, what the
 * grid reports against what tracked time says, and what the month is worth.
 */
class DescribeCra
{
    public function __construct(private readonly MaterializeCraDays $materializeCraDays) {}

    public function handle(Cra $cra): CraData
    {
        $mission = $cra->mission;
        $start = $cra->month->startOfMonth();
        $end = $cra->month->endOfMonth();

        $reported = $this->keyedByDate($cra);
        $tracked = $this->materializeCraDays->handle($mission, $start);
        $holidays = FrenchHolidays::between($start, $end);

        $days = [];

        for ($date = $start; $date->lessThanOrEqualTo($end); $date = $date->addDay()) {
            $key = $date->toDateString();

            $days[] = new CraDayData(
                date: $date,
                dayFractionBp: $reported[$key] ?? 0,
                trackedDayFractionBp: $tracked[$key] ?? 0,
                isWeekend: $date->isWeekend(),
                isHoliday: isset($holidays[$key]),
                holidayName: $holidays[$key] ?? null,
            );
        }

        $totalBp = array_sum($reported);
        $trackedBp = array_sum($tracked);

        return new CraData(
            id: $cra->id,
            missionId: $cra->mission_id,
            month: $cra->month->format('Y-m'),
            status: $cra->status,
            sentOn: $cra->sent_on,
            signedOn: $cra->signed_on,
            totalDays: CraDay::daysFromBasisPoints($totalBp),
            trackedDays: CraDay::daysFromBasisPoints($trackedBp),
            differenceDays: CraDay::daysFromBasisPoints($totalBp - $trackedBp),
            estimatedAmount: $this->estimatedAmount($cra, $totalBp),
            // Compared day by day rather than on the totals: two swapped days net to
            // zero yet still mean the grid no longer matches what was tracked. Only
            // meaningful while the grid can still be reset — an issued CRA reports what
            // the client received, so drifting tracked time does not make it dirty.
            dirty: $cra->isEditable() && $reported !== $tracked,
            editable: $cra->isEditable(),
            notes: $cra->notes,
            days: $days,
        );
    }

    /**
     * @return array<string, int>
     */
    private function keyedByDate(Cra $cra): array
    {
        $reported = [];

        foreach ($cra->days as $day) {
            $reported[$day->date->toDateString()] = $day->day_fraction_bp;
        }

        ksort($reported);

        return $reported;
    }

    /**
     * The month's worth at the mission's rate. Derived from the exact basis points, so
     * the money never travels through a float.
     */
    private function estimatedAmount(Cra $cra, int $totalBp): ?MoneyData
    {
        $rate = $cra->mission->dailyRate();

        if (! $rate instanceof Money) {
            return null;
        }

        return MoneyData::fromMoney(
            $rate->multiply($totalBp)->divide(CraDay::FULL_DAY_BP, MoneyPhp::ROUND_HALF_UP),
        );
    }
}
