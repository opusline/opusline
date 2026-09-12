<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\SubscriptionAmountChangeData;
use App\Domain\Expenses\Data\SubscriptionCategoryTotalData;
use App\Domain\Expenses\Data\SubscriptionData;
use App\Domain\Expenses\Data\SubscriptionKpisData;
use App\Domain\Expenses\Data\SubscriptionOccurrenceData;
use App\Domain\Expenses\Data\SubscriptionsData;
use App\Domain\Expenses\Data\UpcomingDebitData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\SubscriptionOccurrenceState;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Models\SubscriptionAmount;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * The Abonnements tab. Two queries — the subscriptions and their price
 * histories — then everything is derived in PHP on today's prices.
 */
class ListSubscriptions
{
    private const int UPCOMING_DAYS = 30;

    private const int STRIP_MONTHS = 12;

    public function __construct(
        private readonly MaterialiseSubscriptionOccurrences $materialiseSubscriptionOccurrences,
        private readonly DetectRecurringDebits $detectRecurringDebits,
    ) {}

    public function handle(User $user): SubscriptionsData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $currency = $settings->currency->value;

        $this->materialiseSubscriptionOccurrences->handle($user, $today);

        $subscriptions = $user->subscriptions()
            ->with('amounts')
            ->orderBy('supplier')
            ->orderBy('id')
            ->get();

        // Still debiting means a next debit exists: a pause or a cancellation
        // dated today or earlier leaves none, one dated ahead still does.
        $stillDebiting = $subscriptions
            ->filter(static fn (Subscription $subscription): bool => $subscription->stillDebitsAfter($today))
            ->keyBy('id');
        $subscriptions = $subscriptions
            ->sortBy(static fn (Subscription $subscription): int => match (true) {
                $stillDebiting->has($subscription->id) => 0,
                $subscription->is_paused => 1,
                default => 2,
            })
            ->values();
        $active = $stillDebiting->values();
        $categories = $this->categories($active, $today);
        $stripStart = $today->subMonths(self::STRIP_MONTHS - 1)->startOfMonth();
        $occurrences = $this->occurrences($user, $subscriptions, $stripStart, $today);
        $missingReceipts = collect($occurrences)->flatten(1)
            ->filter(static fn (SubscriptionOccurrenceData $occurrence): bool => $occurrence->state === SubscriptionOccurrenceState::Missing)
            ->count();

        return new SubscriptionsData(
            kpis: $this->kpis($active, $today, $currency, $missingReceipts),
            subscriptions: array_values(array_map(
                static fn (Subscription $subscription): SubscriptionData => SubscriptionData::fromModel($subscription, $today, $occurrences[$subscription->id] ?? []),
                $subscriptions->all(),
            )),
            upcoming: $this->upcoming($active, $today),
            categories: $categories,
            yearlyHt: MoneyData::fromMoney(array_reduce(
                $categories,
                static fn (Money $total, SubscriptionCategoryTotalData $row): Money => $total->add($row->yearlyHt->toMoney()),
                new Money(0, $currency),
            )),
            amountChanges: $this->amountChanges($subscriptions, $today),
            detected: $this->detectRecurringDebits->handle($user, $today, $active),
        );
    }

    /**
     * @param  Collection<int, Subscription>  $active
     */
    private function kpis(Collection $active, CarbonImmutable $today, string $currency, int $missingReceipts): SubscriptionKpisData
    {
        $monthly = $yearly = $provisioned = $recoverable = $reverseCharged = new Money(0, $currency);
        $monthlyCount = $annualCount = $provisionedCount = 0;

        foreach ($active as $subscription) {
            $amounts = $subscription->amountsOn($today);
            $perYear = $subscription->periodicity->occurrencesPerYear();
            $recoverable = $recoverable->add($amounts->recoverableVat($subscription->pro_share_bp)->multiply($perYear));

            if ($subscription->vat_treatment->isReverseCharge()) {
                $reverseCharged = $reverseCharged->add($amounts->assessedVat()->multiply($perYear));
            }

            if ($subscription->periodicity === SubscriptionPeriodicity::Annual) {
                $annualCount++;
                $yearly = $yearly->add($amounts->ttc);
                $provision = $subscription->monthlyProvisionOn($today);

                if ($provision instanceof Money) {
                    $provisionedCount++;
                    $provisioned = $provisioned->add($provision);
                }

                continue;
            }

            $monthlyCount++;
            $monthly = $monthly->add($amounts->ttc->divide($subscription->periodicity->months(), MoneyPhp::ROUND_HALF_UP));
        }

        return new SubscriptionKpisData(
            monthlyTtc: MoneyData::fromMoney($monthly),
            monthlyCount: $monthlyCount,
            yearlyTtc: MoneyData::fromMoney($yearly),
            annualCount: $annualCount,
            provisionedCount: $provisionedCount,
            provisionedPerMonth: MoneyData::fromMoney($provisioned),
            recoverableVatPerYear: MoneyData::fromMoney($recoverable),
            reverseChargedVatPerYear: MoneyData::fromMoney($reverseCharged),
            missingReceipts: $missingReceipts,
        );
    }

    /**
     * The twelve-month strip of each subscription: every debit of the window
     * with the expense it became, when it did — one query for the lot.
     *
     * @param  Collection<int, Subscription>  $subscriptions
     * @return array<int, list<SubscriptionOccurrenceData>>
     */
    private function occurrences(User $user, Collection $subscriptions, CarbonImmutable $from, CarbonImmutable $today): array
    {
        $expenses = $user->expenses()
            ->whereNotNull('subscription_id')
            ->where('spent_on', '>=', $from->toDateString())
            ->with('media')
            ->get()
            ->keyBy(static fn (Expense $expense): string => "{$expense->subscription_id}:{$expense->subscription_period_key}");
        $to = $today->endOfMonth();
        $strip = [];

        foreach ($subscriptions as $subscription) {
            $rows = [];

            foreach (new OccurrenceSchedule($subscription)->debitsBetween($from, $to) as $debitOn) {
                $periodKey = $subscription->periodicity->periodKey($debitOn);
                $expense = $expenses->get("{$subscription->id}:{$periodKey}");

                $rows[] = new SubscriptionOccurrenceData(
                    period: $periodKey,
                    debitOn: $debitOn,
                    state: $this->occurrenceState($expense, $debitOn, $subscription, $today),
                    expenseId: $expense?->id,
                );
            }

            $strip[$subscription->id] = $rows;
        }

        return $strip;
    }

    /**
     * The debits of the next thirty days, plus one provision line a month for
     * each annual subscription spread over the year — dated on its debit
     * day so the rail reads like the bank will.
     *
     * @param  Collection<int, Subscription>  $active
     * @return list<UpcomingDebitData>
     */
    private function upcoming(Collection $active, CarbonImmutable $today): array
    {
        $from = $today->addDay();
        $horizon = $today->addDays(self::UPCOMING_DAYS);
        $lines = [];

        foreach ($active as $subscription) {
            foreach (new OccurrenceSchedule($subscription)->debitsBetween($from, $horizon) as $debitOn) {
                $lines[] = new UpcomingDebitData(
                    subscriptionId: $subscription->id,
                    supplier: $subscription->supplier,
                    dueOn: $debitOn,
                    amountTtc: MoneyData::fromMoney($subscription->amountsOn($debitOn)->ttc),
                    periodicity: $subscription->periodicity,
                    isProvision: false,
                );
            }

            if (! $subscription->provision_monthly) {
                continue;
            }

            foreach (OccurrenceSchedule::dayOfEachMonthBetween($subscription->debit_day, max($from, $subscription->started_on), $horizon) as $day) {
                $provision = $subscription->monthlyProvisionOn($day);
                assert($provision instanceof Money);

                $lines[] = new UpcomingDebitData(
                    subscriptionId: $subscription->id,
                    supplier: $subscription->supplier,
                    dueOn: $day,
                    amountTtc: MoneyData::fromMoney($provision),
                    periodicity: $subscription->periodicity,
                    isProvision: true,
                );
            }
        }

        usort($lines, static fn (UpcomingDebitData $a, UpcomingDebitData $b): int => [$a->dueOn->toDateString(), $a->supplier] <=> [$b->dueOn->toDateString(), $b->supplier]);

        return $lines;
    }

    private function occurrenceState(?Expense $expense, CarbonImmutable $debitOn, Subscription $subscription, CarbonImmutable $today): SubscriptionOccurrenceState
    {
        if ($expense instanceof Expense) {
            return $expense->receipt() instanceof Media ? SubscriptionOccurrenceState::Linked : SubscriptionOccurrenceState::Missing;
        }

        if ($debitOn->lessThanOrEqualTo($today)) {
            return SubscriptionOccurrenceState::Inactive;
        }

        return $subscription->is_paused ? SubscriptionOccurrenceState::Paused : SubscriptionOccurrenceState::Future;
    }

    /**
     * @param  Collection<int, Subscription>  $active
     * @return list<SubscriptionCategoryTotalData>
     */
    private function categories(Collection $active, CarbonImmutable $today): array
    {
        /** @var array<int, Money> $totals */
        $totals = [];

        foreach ($active as $subscription) {
            $yearly = $subscription->priceOn($today)->multiply($subscription->periodicity->occurrencesPerYear());
            $key = $subscription->category->value;
            $totals[$key] = isset($totals[$key]) ? $totals[$key]->add($yearly) : $yearly;
        }

        uasort($totals, static fn (Money $a, Money $b): int => $b->compare($a));

        $rows = [];

        foreach ($totals as $category => $yearly) {
            $rows[] = new SubscriptionCategoryTotalData(category: ExpenseCategory::from($category), yearlyHt: MoneyData::fromMoney($yearly));
        }

        return $rows;
    }

    /**
     * The latest price change of each subscription that has one in force —
     * a change dated in the future waits until it applies.
     *
     * @param  Collection<int, Subscription>  $subscriptions
     * @return list<SubscriptionAmountChangeData>
     */
    private function amountChanges(Collection $subscriptions, CarbonImmutable $today): array
    {
        $changes = [];

        foreach ($subscriptions as $subscription) {
            $inForce = $subscription->amounts
                ->filter(static fn (SubscriptionAmount $amount): bool => $amount->effective_from->lessThanOrEqualTo($today))
                ->values()
                ->all();

            if (count($inForce) < 2) {
                continue;
            }

            [$before, $after] = array_slice($inForce, -2);

            $changes[] = new SubscriptionAmountChangeData(
                subscriptionId: $subscription->id,
                supplier: $subscription->supplier,
                before: MoneyData::fromMoney($before->amount_ht_cents),
                after: MoneyData::fromMoney($after->amount_ht_cents),
                changeBp: Rate::shareBp(
                    (int) $after->amount_ht_cents->getAmount() - (int) $before->amount_ht_cents->getAmount(),
                    (int) $before->amount_ht_cents->getAmount(),
                ),
                since: $after->effective_from,
            );
        }

        usort($changes, static fn (SubscriptionAmountChangeData $a, SubscriptionAmountChangeData $b): int => $b->since->toDateString() <=> $a->since->toDateString());

        return $changes;
    }
}
