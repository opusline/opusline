<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * A subscription as the Abonnements tab lists it. The amounts are the price
 * in force today — the history is carried alongside for the change card.
 */
class SubscriptionData extends Data
{
    /**
     * @param  list<SubscriptionAmountData>  $amounts
     */
    public function __construct(
        public int $id,
        public string $supplier,
        public ExpenseCategory $category,
        public ?string $description,
        public MoneyData $amountHt,
        /** The TVA each debit carries: invoiced, or self-assessed under reverse charge. */
        public MoneyData $vat,
        public MoneyData $amountTtc,
        public MoneyData $recoverableVat,
        public int $proShareBp,
        public ExpenseVatTreatment $vatTreatment,
        public int $vatRateBp,
        public SubscriptionPeriodicity $periodicity,
        public int $debitDay,
        public ?int $debitMonth,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $startedOn,
        public ?string $customerSpaceUrl,
        public bool $autoCreateExpenses,
        public bool $provisionMonthly,
        /** A twelfth of the annual debit, while it is provisioned month by month. */
        public ?MoneyData $monthlyProvision,
        public bool $isPaused,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $cancelledOn,
        /** Null once the subscription is paused or cancelled. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $nextDebitOn,
        #[DataCollectionOf(SubscriptionAmountData::class)]
        public array $amounts,
    ) {}

    public static function fromModel(Subscription $subscription, CarbonImmutable $today): self
    {
        $amounts = $subscription->amountsOn($today);
        $provision = $subscription->monthlyProvisionOn($today);

        return new self(
            id: $subscription->id,
            supplier: $subscription->supplier,
            category: $subscription->category,
            description: $subscription->description,
            amountHt: MoneyData::fromMoney($amounts->ht),
            vat: MoneyData::fromMoney($amounts->assessedVat()),
            amountTtc: MoneyData::fromMoney($amounts->ttc),
            recoverableVat: MoneyData::fromMoney($amounts->recoverableVat($subscription->pro_share_bp)),
            proShareBp: $subscription->pro_share_bp,
            vatTreatment: $subscription->vat_treatment,
            vatRateBp: $subscription->vat_rate_bp,
            periodicity: $subscription->periodicity,
            debitDay: $subscription->debit_day,
            debitMonth: $subscription->debit_month,
            startedOn: $subscription->started_on,
            customerSpaceUrl: $subscription->customer_space_url,
            autoCreateExpenses: $subscription->auto_create_expenses,
            provisionMonthly: $subscription->provision_monthly,
            monthlyProvision: $provision instanceof Money ? MoneyData::fromMoney($provision) : null,
            isPaused: $subscription->is_paused,
            cancelledOn: $subscription->cancelled_on,
            nextDebitOn: new OccurrenceSchedule($subscription)->nextDebitOn($today),
            amounts: array_values(array_map(
                SubscriptionAmountData::fromModel(...),
                $subscription->amounts->all(),
            )),
        );
    }
}
