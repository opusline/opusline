<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DetachExpenseReceipt
{
    public function handle(Expense $expense): void
    {
        if (! $expense->receipt() instanceof Media) {
            return;
        }

        $expense->clearMediaCollection(Expense::RECEIPT_COLLECTION);
        $expense->update([
            'vat_claim_period' => DeclaredCa3Months::of($expense->user_id)->reclaim($expense->month(), $expense->vat_claim_period),
        ]);
    }
}
