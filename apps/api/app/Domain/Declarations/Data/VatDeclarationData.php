<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The monthly CA3 helper — one figure per form case, cash basis like the
 * revenue screen. Only réel normal declares monthly, so this block exists for
 * that regime alone; the déductible and crédit cases are deliberately absent
 * until the app can back them with data.
 */
class VatDeclarationData extends Data
{
    public function __construct(
        /** The declared month's key, `2026-07`. */
        public string $period,
        /** The régime this block was built for, so the client captions it rather than guessing. */
        public VatRegime $regime,
        /** Case 01 — services sold HT, summed from the invoices paid in the month. */
        public MoneyData $salesHt,
        /** Case 08 — the VAT those invoices actually carried, per-invoice actuals. */
        public MoneyData $collected,
        /**
         * The one rate every paid invoice carries — caption context, not the sum's
         * input. Null once they disagree; the account default on an empty month.
         */
        public ?int $rateBp,
    ) {}
}
