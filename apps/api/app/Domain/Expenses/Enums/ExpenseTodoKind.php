<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/** The cards of the journal's « À traiter » rail. */
enum ExpenseTodoKind: int
{
    /** A subscription's debit was recorded; the receipt is still to be linked. */
    case MissingReceipt = 0;
    /** A recurring bank debit no expense matches (a later rung fills it). */
    case UnmatchedDebit = 1;
    /** An annual subscription debits within the month. */
    case UpcomingAnnualDebit = 2;
}
