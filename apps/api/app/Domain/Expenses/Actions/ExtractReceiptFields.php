<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ReceiptSuggestionData;
use App\Domain\Expenses\Receipts\ReceiptHeuristics;
use App\Domain\Expenses\Receipts\ReceiptText;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;

/**
 * Prefills the expense form from a receipt without keeping the file: the
 * user checks the suggestion, then attaches the receipt to the expense it
 * creates. Dates are read against the account's own today, amounts in its
 * currency.
 */
class ExtractReceiptFields
{
    public function handle(User $user, UploadedFile $file): ReceiptSuggestionData
    {
        $text = ReceiptText::from($file);

        if ($text === null) {
            return new ReceiptSuggestionData(textFound: false);
        }

        $settings = $user->settingsOrFail();

        return ReceiptHeuristics::suggest($text, $settings->today(), $settings->currency);
    }
}
