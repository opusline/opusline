<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Data\SubscriptionInputData;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

/**
 * The two ways the sheet ties a purchase to a subscription: as the debit of
 * one that exists (« Lier à l'abonnement »), or as the first debit of a
 * monthly one created on the spot (« Récurrent · le N du mois »). Runs
 * inside CreateExpense's transaction, on the row it just wrote.
 */
class LinkExpenseToSubscription
{
    public function __construct(private readonly CreateSubscription $createSubscription) {}

    /**
     * @throws ValidationException
     */
    public function handle(User $user, Expense $expense, ExpenseInputData $data): void
    {
        if ($data->subscriptionId !== null && $data->recurringDebitDay !== null) {
            throw ValidationException::withMessages(['recurringDebitDay' => __('expenses.one_subscription_link')]);
        }

        if ($data->subscriptionId !== null) {
            $subscription = $user->subscriptions()->find($data->subscriptionId);

            if (! $subscription instanceof Subscription) {
                throw ValidationException::withMessages(['subscriptionId' => __('expenses.unknown_subscription')]);
            }

            $this->attach($expense, $subscription);
        }

        if ($data->recurringDebitDay !== null) {
            $this->attach($expense, $this->subscriptionFrom($user, $expense, $data->recurringDebitDay));
        }
    }

    private function attach(Expense $expense, Subscription $subscription): void
    {
        $periodKey = $subscription->periodicity->periodKey($expense->spent_on);

        // Tombstones count: a debit deleted for that period was not taken.
        if ($subscription->expenses()->withTrashed()->where('subscription_period_key', $periodKey)->exists()) {
            abort(409, __('expenses.occurrence_taken'));
        }

        $expense->update(['subscription_id' => $subscription->id, 'subscription_period_key' => $periodKey]);
    }

    /** A monthly subscription with the purchase's terms, priced at its HT, starting on its day. */
    private function subscriptionFrom(User $user, Expense $expense, int $debitDay): Subscription
    {
        return $this->createSubscription->handle($user, new SubscriptionInputData(
            supplier: $expense->supplier,
            category: $expense->category,
            amountHt: MoneyData::fromMoney($expense->amount_ht_cents),
            vatTreatment: $expense->vat_treatment,
            vatRateBp: $expense->vat_rate_bp,
            periodicity: SubscriptionPeriodicity::Monthly,
            debitDay: $debitDay,
            startedOn: $expense->spent_on->toDateString(),
            proShareBp: $expense->pro_share_bp,
            description: $expense->description,
        ));
    }
}
