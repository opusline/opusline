<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * What should stay on the account before any transfer: TVA collected but not
 * yet declared (null under the franchise en base), URSSAF due on the current
 * period's collections (null outside French fiscality), the elapsed share of
 * the expected CFE (null until the user names an amount, and in the exempt
 * creation year), and the matelas the user configured (null when unset).
 */
class BankProvisionsData extends Data
{
    public function __construct(
        public ?BankProvisionData $vat,
        public ?BankProvisionData $urssaf,
        public ?BankProvisionData $cfe,
        public ?MoneyData $buffer,
        public MoneyData $total,
    ) {}
}
