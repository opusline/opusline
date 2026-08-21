<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

/**
 * The facts behind a forfait that is running out, or has already run over: which
 * mission it is, where to open it, and the budget figures the row states in words.
 *
 * The slugs travel with it because the row's first action is a link to the mission,
 * and the listing has no other way to build that URL.
 */
class InvoiceTodoBudgetData extends Data
{
    /**
     * @param  int  $vatRateBp  The rate an invoice for this forfait starts on, resolved
     *                          from the client and the account regime — same reason as
     *                          InvoiceTodoWorkData carries it.
     */
    public function __construct(
        public int $missionId,
        public string $missionName,
        public string $missionSlug,
        public string $clientSlug,
        public FixedPriceBudgetData $budget,
        public int $vatRateBp,
    ) {}
}
