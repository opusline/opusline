<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\EInvoicing\Enums\LifecycleStatus;
use App\Domain\Expenses\Models\Expense;
use Spatie\LaravelData\Data;

/** The received e-invoice behind an expense, as the plateforme agréée tracks it. */
class ExpenseEInvoiceData extends Data
{
    public function __construct(
        public string $platformId,
        /** Where the invoice stands in the cycle de vie, as of the last sync. */
        public LifecycleStatus $status,
    ) {}

    public static function fromModel(Expense $expense): ?self
    {
        if ($expense->e_invoice_platform_id === null) {
            return null;
        }

        return new self($expense->e_invoice_platform_id, $expense->e_invoice_status ?? LifecycleStatus::Received);
    }
}
