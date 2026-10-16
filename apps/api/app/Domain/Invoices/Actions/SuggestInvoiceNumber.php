<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\NextInvoiceNumberData;
use App\Domain\Invoices\Documents\DocumentNumberSeries;
use App\Domain\Users\Models\User;

/** Renders the user's invoice_number_format for today and proposes the next counter. */
class SuggestInvoiceNumber
{
    public function handle(User $user): NextInvoiceNumberData
    {
        $settings = $user->settingsOrFail();

        return new NextInvoiceNumberData(
            number: DocumentNumberSeries::next(
                $settings->invoice_number_format,
                $settings->today(),
                static fn (string $prefix): array => $user->invoices()
                    ->whereNotNull('number')
                    ->where('number', 'like', $prefix.'%')
                    ->pluck('number')
                    ->all(),
            ),
            format: $settings->invoice_number_format,
        );
    }
}
