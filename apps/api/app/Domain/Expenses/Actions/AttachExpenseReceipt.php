<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Documents\Actions\StoreMediaFile;
use App\Domain\Documents\Support\StoredFileName;
use App\Domain\Expenses\Data\UploadExpenseReceiptData;
use App\Domain\Expenses\Models\Expense;
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
     * costs a TVA deduction, a lost logo costs a second upload.
     */
    public function handle(Expense $expense, UploadExpenseReceiptData $data): Media
    {
        return DB::transaction(function () use ($expense, $data): Media {
            $locked = Expense::query()->whereKey($expense->id)->lockForUpdate()->firstOrFail();

            return $this->storeMediaFile->handle(
                $locked,
                $data->file->getRealPath(),
                StoredFileName::for($data->file),
                Expense::RECEIPT_COLLECTION,
            );
        });
    }
}
