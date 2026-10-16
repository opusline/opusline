<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Documents\DocumentNumberSeries;
use App\Domain\Users\Models\User;

/** The next number of the quotes' own series, rendered from quote_number_format for today. */
class SuggestQuoteNumber
{
    public function handle(User $user): string
    {
        $settings = $user->settingsOrFail();

        return DocumentNumberSeries::next(
            $settings->quote_number_format,
            $settings->today(),
            static fn (string $prefix): array => $user->quotes()
                ->whereNotNull('number')
                ->where('number', 'like', $prefix.'%')
                ->pluck('number')
                ->all(),
        );
    }
}
