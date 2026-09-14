<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Documents\Actions\StoreMediaFile;
use App\Domain\Documents\Support\StoredFileName;
use App\Domain\Expenses\Data\UploadExpenseReceiptData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AttachExpenseReceipt
{
    public function __construct(private readonly StoreMediaFile $storeMediaFile) {}

    /**
     * A single-file collection: attaching over an existing receipt replaces
     * it, which is what re-uploading a corrected invoice means. The row lock
     * serializes two uploads racing for the same expense — each would
     * otherwise clear the other's file and leave none. The logo and signature
     * collections run the same race unguarded on purpose: a lost justificatif
     * costs a TVA deduction, a lost logo costs a second upload. The account
     * lock comes first, like every other writer of a claim period, so a CA3
     * marked declared meanwhile cannot slip between the read and the write.
     */
    public function handle(Expense $expense, UploadExpenseReceiptData $data): Media
    {
        return DB::transaction(function () use ($expense, $data): Media {
            User::lockRow($expense->user_id);
            $locked = Expense::query()->whereKey($expense->id)->lockForUpdate()->firstOrFail();

            $locked->update([
                'vat_claim_period' => DeclaredCa3Months::of($locked->user_id)->reclaim($locked->month(), $locked->vat_claim_period, $locked->isDeferred()),
            ]);

            return $this->storeMediaFile->handle(
                $locked,
                $data->file->getRealPath(),
                StoredFileName::for($data->file),
                Expense::RECEIPT_COLLECTION,
            );
        });
    }
}
