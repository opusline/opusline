<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * What should stay on the account before any transfer: TVA collected but not
 * yet declared (null under the franchise en base), URSSAF due on the current
 * period's collections (null outside French fiscality), and the matelas the
 * user configured (null when unset).
 */
class BankProvisionsData extends Data
{
    public function __construct(
        public ?BankProvisionData $vat,
        public ?BankProvisionData $urssaf,
        public ?MoneyData $buffer,
        public MoneyData $total,
    ) {}
}
