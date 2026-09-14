<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/**
 * Where a purchase's TVA stands with the CA3. Derived on every read from the
 * receipt, the claim period and the declared months — never stored, so
 * un-marking a declaration honestly flips the rows back.
 */
enum ExpenseVatStatus: int
{
    /** Receipted and waiting for its CA3 to be declared. */
    case Deductible = 0;

    /** Its CA3 was marked declared: the deduction is filed. */
    case Deducted = 1;

    /** Claimed on a later CA3 than the purchase month, by choice or because that month was already declared. */
    case Deferred = 2;

    /** No receipt: the fisc refuses the deduction until one is attached. */
    case Blocked = 3;

    /** Autoliquidation: due and deducted on the same CA3, nothing to recover. */
    case ReverseCharged = 4;

    /** Exempt purchase, a receipt whose TVA is not tracked, or an account that files no CA3. */
    case NotApplicable = 5;

    /** Whether the recoverable TVA lands on some CA3 — the states a deduction total counts. */
    public function isClaimed(): bool
    {
        return in_array($this, [self::Deductible, self::Deducted, self::Deferred], true);
    }
}
