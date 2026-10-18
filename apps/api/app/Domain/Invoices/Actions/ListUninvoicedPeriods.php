<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\UninvoicedPeriodData;
use App\Domain\Invoices\Data\UninvoicedPeriodListData;
use App\Domain\Invoices\Revenue\NetIncome;
use App\Domain\Settings\Rates\ContributionRateHistory;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * @phpstan-import-type UnbilledWork from FindUnbilledWork
 */
class ListUninvoicedPeriods
{
    public function __construct(
        private readonly FindUnbilledWork $findUnbilledWork,
        private readonly ContributionRateHistory $contributionRateHistory,
    ) {}

    public function handle(User $user): UninvoicedPeriodListData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $netIncome = NetIncome::forAccount($settings, $this->contributionRateHistory);

        $periods = array_map(
            /** @param UnbilledWork $work */
            function (array $work) use ($netIncome, $today): UninvoicedPeriodData {
                $entries = $work['entries'];
                $amountNet = $netIncome?->of($work['amount'], $today);

                return new UninvoicedPeriodData(
                    id: $work['mission']->id,
                    client: $work['mission']->client->name,
                    from: $entries[0]->date,
                    to: $entries[count($entries) - 1]->date,
                    days: $work['days'],
                    minutes: $work['minutes'],
                    amountHt: MoneyData::fromMoney($work['amount']),
                    amountNet: $amountNet instanceof Money ? MoneyData::fromMoney($amountNet) : null,
                );
            },
            // The month only shapes the dashboard's month card, which this list has no use for.
            $this->findUnbilledWork->handle($user, $today, $settings->workday_minutes),
        );

        return new UninvoicedPeriodListData(periods: $periods);
    }
}
