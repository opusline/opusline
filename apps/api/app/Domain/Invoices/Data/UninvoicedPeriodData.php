<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * A mission's billable time that no invoice covers yet — the « période travaillée
 * non facturée » row of the Factures screen.
 */
class UninvoicedPeriodData extends Data
{
    public function __construct(
        /**
         * The mission's id. One mission has at most one period: the row shrinks when an
         * invoice covers part of its time, disappears when one covers all of it — in the
         * same transaction that creates the invoice — and comes back under the same id
         * when new time is tracked on the mission.
         */
        public int $id,
        /** The client's name. */
        public string $client,
        /** The first day of tracked time in the period. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $from,
        /** The last day of tracked time in the period. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $to,
        /** Billed days on a mission with a daily rate; null on a mission billed by the hour. */
        public ?float $days,
        /** Billed minutes on a mission billed by the hour; null on a mission with a daily rate. */
        public ?int $minutes,
        /** What the period bills, at the mission's rate. */
        public MoneyData $amountHt,
        /**
         * `amountHt` less what the treasury sets aside on it, priced as if collected
         * today — the same deductions as an invoice's `amountNet`. Null for an account
         * outside French fiscality.
         */
        public ?MoneyData $amountNet,
    ) {}
}
