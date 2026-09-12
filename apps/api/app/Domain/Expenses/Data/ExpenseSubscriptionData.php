<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Subscription;
use Spatie\LaravelData\Data;

/** The subscription an expense is a debit of — enough for the ↻ mark and the link. */
class ExpenseSubscriptionData extends Data
{
    public function __construct(
        public int $id,
        public string $supplier,
        public SubscriptionPeriodicity $periodicity,
    ) {}

    public static function fromModel(Subscription $subscription): self
    {
        return new self(id: $subscription->id, supplier: $subscription->supplier, periodicity: $subscription->periodicity);
    }
}
