<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Shared\Money\Rate;
use Cknow\Money\Money;

class ComputeInvoiceAmounts
{
    public function vatFor(Money $amountHt, int $vatRateBp): Money
    {
        return Rate::of($amountHt, $vatRateBp);
    }

    public function ttcFor(Money $amountHt, int $vatRateBp): Money
    {
        return $amountHt->add($this->vatFor($amountHt, $vatRateBp));
    }
}
