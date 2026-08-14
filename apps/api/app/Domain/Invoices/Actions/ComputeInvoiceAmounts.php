<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use Cknow\Money\Money;
use Money\Money as MoneyPhp;

class ComputeInvoiceAmounts
{
    private const int BASIS_POINTS = 10_000;

    public function vatFor(Money $amountHt, int $vatRateBp): Money
    {
        return $amountHt
            ->multiply($vatRateBp)
            ->divide(self::BASIS_POINTS, MoneyPhp::ROUND_HALF_UP);
    }

    public function ttcFor(Money $amountHt, int $vatRateBp): Money
    {
        return $amountHt->add($this->vatFor($amountHt, $vatRateBp));
    }
}
