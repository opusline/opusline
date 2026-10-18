<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ReceiptSuggestionData;
use App\Domain\Expenses\Enums\ClaudeReadingFailure;
use App\Domain\Expenses\Enums\ReceiptReader;
use App\Domain\Expenses\Receipts\ClaudeReadingFailed;
use App\Domain\Expenses\Receipts\ClaudeReceiptReader;
use App\Domain\Expenses\Receipts\ReceiptHeuristics;
use App\Domain\Expenses\Receipts\ReceiptText;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

/**
 * Prefills the expense form from a receipt without keeping the file: the
 * user checks the suggestion, then attaches the receipt to the expense it
 * creates. Claude reads it when the account gave a key, unless the account
 * picked the heuristics for this receipt; the heuristics read it otherwise,
 * or when Claude fails, and the answer says which. Dates are read
 * against the account's own today, amounts in its currency.
 */
class ExtractReceiptFields
{
    public function handle(User $user, UploadedFile $file, ?ReceiptReader $requestedReader): ReceiptSuggestionData
    {
        $settings = $user->settingsOrFail();

        if ($requestedReader === ReceiptReader::Claude && $settings->anthropic_api_key === null) {
            throw ValidationException::withMessages(['reader' => __('expenses.receipt_reader_needs_key')]);
        }

        if ($requestedReader === ReceiptReader::Heuristics || $settings->anthropic_api_key === null) {
            return $this->readWithHeuristics($user, $file, null);
        }

        try {
            return ClaudeReceiptReader::read($settings->anthropic_api_key, $file, $settings->today(), $settings->currency);
        } catch (ClaudeReadingFailed $failure) {
            // A refused key is the account's to replace; the rest is worth a look.
            if ($failure->reason !== ClaudeReadingFailure::KeyRejected) {
                report($failure);
            }

            return $this->readWithHeuristics($user, $file, $failure->reason);
        }
    }

    private function readWithHeuristics(User $user, UploadedFile $file, ?ClaudeReadingFailure $claudeFailure): ReceiptSuggestionData
    {
        $text = ReceiptText::from($file);

        if ($text === null) {
            return new ReceiptSuggestionData(textFound: false, reader: ReceiptReader::Heuristics, claudeFailure: $claudeFailure);
        }

        $settings = $user->settingsOrFail();

        return ReceiptHeuristics::suggest($text, $settings->today(), $settings->currency, $claudeFailure);
    }
}
