<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\DB;

/**
 * Turns the debits that have come due into expenses, on read rather than on
 * a schedule: the journal and the tab call it before they look, so what
 * they show is what the bank did. Idempotent by (subscription, period) —
 * a deleted debit's tombstone counts — and never further back than the
 * subscription's occurrence floor: the day it was recorded, or resumed.
 *
 * The read that has nothing to write opens no transaction and takes no lock.
 * Both the calendar walk and the probe restart at each subscription's latest
 * settled period rather than at its first: this sits on the two hottest reads
 * of the domain, and neither may cost more as the account ages.
 */
class MaterialiseSubscriptionOccurrences
{
    public function __construct(private readonly SuggestExpenseMatches $suggestExpenseMatches) {}

    public function handle(User $user, CarbonImmutable $today): void
    {
        if ($this->pending($user, $today) === []) {
            return;
        }

        DB::transaction(function () use ($user, $today): void {
            User::lockRow($user->id);

            $declared = DeclaredCa3Months::of($user->id);
            $earliest = null;

            // Asked again under the lock: the gate above ran outside it, and a
            // concurrent read may have written the same occurrence meanwhile.
            foreach ($this->pending($user, $today) as [$subscription, $periodKey, $debitOn]) {
                $this->create($user, $subscription, $periodKey, $debitOn, $declared);
                $earliest = min($earliest ?? $debitOn, $debitOn);
            }

            // A debit the bank already imported may be waiting for exactly
            // the expense that was just written.
            if ($earliest instanceof CarbonImmutable) {
                $this->suggestExpenseMatches->handle($user, $earliest);
            }
        });
    }

    /**
     * The debits that have come due and have neither an expense nor a
     * tombstone of their own yet.
     *
     * @return list<array{Subscription, string, CarbonImmutable}>
     */
    private function pending(User $user, CarbonImmutable $today): array
    {
        $subscriptions = $user->subscriptions()
            ->where('auto_create_expenses', true)
            ->where('is_paused', false)
            ->with('amounts')
            ->get();

        if ($subscriptions->isEmpty()) {
            return [];
        }

        $scanFrom = $this->scanFrom($user, $subscriptions);
        /** @var array<string, array{Subscription, string, CarbonImmutable}> $due */
        $due = [];

        foreach ($subscriptions as $subscription) {
            foreach (new OccurrenceSchedule($subscription)->debitsBetween($scanFrom[$subscription->id], $today) as $debitOn) {
                $periodKey = $subscription->periodicity->periodKey($debitOn);
                $due["{$subscription->id}:{$periodKey}"] = [$subscription, $periodKey, $debitOn];
            }
        }

        if ($due === []) {
            return [];
        }

        return array_values(array_diff_key($due, $this->taken($user, $due)));
    }

    /**
     * The first day of each subscription's calendar still worth walking: its
     * occurrence floor, or the start of the period its latest debit falls in
     * when that is later. Everything before it was settled by an earlier pass
     * — a written expense, or the tombstone of a deleted one — so a ten-year-old
     * monthly subscription costs the same to check as a new one. The period is
     * what the floor snaps to, not the day: a debit's date may be corrected
     * afterwards to the day the bank really took it.
     *
     * @param  Collection<int, Subscription>  $subscriptions
     * @return array<int, CarbonImmutable>
     */
    private function scanFrom(User $user, Collection $subscriptions): array
    {
        /** @var SupportCollection<int, object{subscription_id: int, last_debit_on: string}> $rows */
        $rows = $user->expenses()
            ->withTrashed()
            ->whereIn('subscription_id', $subscriptions->modelKeys())
            ->toBase()
            ->select('subscription_id')
            ->selectRaw('MAX(spent_on) as last_debit_on')
            ->groupBy('subscription_id')
            ->get();

        $latest = [];

        foreach ($rows as $row) {
            $latest[(int) $row->subscription_id] = CarbonImmutable::parse($row->last_debit_on);
        }

        $scanFrom = [];

        foreach ($subscriptions as $subscription) {
            $floor = $subscription->occurrencesFrom();
            $lastDebitOn = $latest[$subscription->id] ?? null;
            $scanFrom[$subscription->id] = $lastDebitOn instanceof CarbonImmutable
                ? max($floor, $subscription->periodicity->periodStart($lastDebitOn))
                : $floor;
        }

        return $scanFrom;
    }

    /**
     * Which of the asked-about (subscription, period) pairs the account
     * already holds. Tombstones count: a deleted debit must not come back.
     *
     * @param  array<string, array{Subscription, string, CarbonImmutable}>  $due
     * @return array<string, true>
     */
    private function taken(User $user, array $due): array
    {
        $subscriptionIds = [];
        $periodKeys = [];

        foreach ($due as [$subscription, $periodKey]) {
            $subscriptionIds[$subscription->id] = true;
            $periodKeys[$periodKey] = true;
        }

        /** @var SupportCollection<int, object{subscription_id: int, subscription_period_key: string}> $rows */
        $rows = $user->expenses()
            ->withTrashed()
            ->whereIn('subscription_id', array_keys($subscriptionIds))
            ->whereIn('subscription_period_key', array_keys($periodKeys))
            ->toBase()
            ->get(['subscription_id', 'subscription_period_key']);

        $taken = [];

        foreach ($rows as $row) {
            $taken["{$row->subscription_id}:{$row->subscription_period_key}"] = true;
        }

        return $taken;
    }

    private function create(User $user, Subscription $subscription, string $periodKey, CarbonImmutable $debitOn, DeclaredCa3Months $declared): void
    {
        $amounts = $subscription->amountsOn($debitOn);

        $user->expenses()->create([
            'subscription_id' => $subscription->id,
            'subscription_period_key' => $periodKey,
            'supplier' => $subscription->supplier,
            'category' => $subscription->category,
            'description' => $subscription->description,
            'spent_on' => $debitOn,
            'vat_claim_period' => $declared->claimFor($debitOn->format('Y-m')),
            'vat_treatment' => $subscription->vat_treatment,
            'vat_rate_bp' => $subscription->vat_rate_bp,
            'pro_share_bp' => $subscription->pro_share_bp,
            'currency' => $subscription->currency,
            'amount_ttc_cents' => (int) $amounts->ttc->getAmount(),
            'amount_ht_cents' => (int) $amounts->ht->getAmount(),
        ]);
    }
}
