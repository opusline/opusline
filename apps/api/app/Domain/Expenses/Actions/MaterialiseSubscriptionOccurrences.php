<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Turns the debits that have come due into expenses, on read rather than on
 * a schedule: the journal and the tab call it before they look, so what
 * they show is what the bank did. Idempotent by (subscription, period) —
 * a deleted debit's tombstone counts — and never further back than the
 * subscription's occurrence floor: the day it was recorded, or resumed.
 */
class MaterialiseSubscriptionOccurrences
{
    public function __construct(private readonly SuggestExpenseMatches $suggestExpenseMatches) {}

    public function handle(User $user, CarbonImmutable $today): void
    {
        $due = $user->subscriptions()->where('auto_create_expenses', true)->where('is_paused', false);

        if ($due->clone()->doesntExist()) {
            return;
        }

        DB::transaction(function () use ($user, $today, $due): void {
            User::lockRow($user->id);

            $subscriptions = $due->with('amounts')->get();
            /** @var Collection<int, object{subscription_id: int, subscription_period_key: string}> $rows */
            $rows = $user->expenses()->withTrashed()->whereNotNull('subscription_id')->toBase()->get(['subscription_id', 'subscription_period_key']);
            /** @var array<string, true> $taken */
            $taken = [];

            foreach ($rows as $row) {
                $taken["{$row->subscription_id}:{$row->subscription_period_key}"] = true;
            }

            $declared = DeclaredCa3Months::of($user->id);
            $earliest = null;

            foreach ($subscriptions as $subscription) {
                foreach (new OccurrenceSchedule($subscription)->debitsBetween($subscription->occurrencesFrom(), $today) as $debitOn) {
                    $periodKey = $subscription->periodicity->periodKey($debitOn);

                    if (isset($taken["{$subscription->id}:{$periodKey}"])) {
                        continue;
                    }

                    $this->create($user, $subscription, $periodKey, $debitOn, $declared);
                    $earliest = min($earliest ?? $debitOn, $debitOn);
                }
            }

            // A debit the bank already imported may be waiting for exactly
            // the expense that was just written.
            if ($earliest instanceof CarbonImmutable) {
                $this->suggestExpenseMatches->handle($user, $earliest);
            }
        });
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
