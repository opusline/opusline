<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use Spatie\LaravelData\Data;

/**
 * What a receipt says about the expense it backs, field by field, each
 * with how sure the reading is. Nothing here is stored: the form prefills
 * itself and the user confirms. The category never carries a confidence —
 * it is always a guess to check.
 */
class ReceiptSuggestionData extends Data
{
    public function __construct(
        /** False when the file had no text layer to read: an image, a scan, a damaged PDF. */
        public bool $textFound,
        public ?ReceiptTextFieldData $supplier = null,
        public ?ReceiptDateFieldData $spentOn = null,
        public ?ReceiptAmountFieldData $amountTtc = null,
        public ?ReceiptVatFieldData $vat = null,
        public ?ReceiptTextFieldData $description = null,
        public ?ExpenseCategory $category = null,
    ) {}
}
