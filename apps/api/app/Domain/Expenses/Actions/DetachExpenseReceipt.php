<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DetachExpenseReceipt
{
    /** Under the same locks as the attach: the account's, then the expense row's. */
    public function handle(Expense $expense): void
    {
        DB::transaction(function () use ($expense): void {
            User::lockRow($expense->user_id);
            $locked = Expense::query()->whereKey($expense->id)->lockForUpdate()->firstOrFail();

            if (! $locked->receipt() instanceof Media) {
                return;
            }

            $locked->clearMediaCollection(Expense::RECEIPT_COLLECTION);
            $locked->update([
                'vat_claim_period' => DeclaredCa3Months::of($locked->user_id)->reclaim($locked->month(), $locked->vat_claim_period, $locked->isDeferred()),
            ]);
        });
    }
}
