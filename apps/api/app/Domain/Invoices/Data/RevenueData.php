<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\RevenueBasis;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Everything on the Revenus screen.
 */
class RevenueData extends Data
{
    /**
     * @param  list<RevenueMonthData>  $months
     * @param  list<InvoiceListItemData>  $invoices
     * @param  list<RevenueClientData>  $clients
     */
    public function __construct(
        /** The period actually shown — the requested one, or the fallback. */
        public string $period,
        public RevenueBasis $basis,
        /** True when no period was asked and an empty current month was substituted. */
        public bool $fellBack,
        /** The most recent period of the same kind with activity; null on a silent account. */
        public ?string $lastActivePeriod,
        /** CA HT of the period under the basis. */
        public MoneyData $total,
        public RevenueComparisonData $previous,
        public ?RevenueVatData $vat,
        public ?RevenueNetData $net,
        #[DataCollectionOf(RevenueMonthData::class)]
        public array $months,
        /** The period's invoices under the basis, most recent first. */
        #[DataCollectionOf(InvoiceListItemData::class)]
        public array $invoices,
        /** Revenue grouped by client, largest first. */
        #[DataCollectionOf(RevenueClientData::class)]
        public array $clients,
    ) {}
}
