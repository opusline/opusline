<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Documents\DocumentNumberSeries;
use App\Domain\Users\Models\User;

/** The next number of the credit notes' own series, rendered from credit_note_number_format for today. */
class SuggestCreditNoteNumber
{
    public function handle(User $user): string
    {
        $settings = $user->settingsOrFail();

        return DocumentNumberSeries::next(
            $settings->credit_note_number_format,
            $settings->today(),
            static fn (string $prefix): array => $user->creditNotes()
                ->whereNotNull('number')
                ->where('number', 'like', $prefix.'%')
                ->pluck('number')
                ->all(),
        );
    }
}
