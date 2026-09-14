<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Enums;

/** Where the micro-BNC receipts go on the 2042-C PRO. */
enum IncomeTaxReturnBox: int
{
    /** Case 5TE — the versement libératoire was opted for; the tax is already paid. */
    case WithLiberatingPayment = 0;
    /** Case 5HQ — no option; the receipts join the household's taxable income after the abatement. */
    case WithoutLiberatingPayment = 1;
}
