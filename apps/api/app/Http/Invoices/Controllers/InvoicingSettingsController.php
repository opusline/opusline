<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\SuggestCreditNoteNumber;
use App\Domain\Invoices\Actions\SuggestInvoiceNumber;
use App\Domain\Invoices\Actions\SuggestQuoteNumber;
use App\Domain\Invoices\Actions\UpdateInvoicingSettings;
use App\Domain\Invoices\Data\InvoicingSettingsData;
use App\Domain\Invoices\Data\UpdateInvoicingSettingsData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;

class InvoicingSettingsController extends Controller
{
    public function __construct(
        private readonly SuggestInvoiceNumber $suggestInvoiceNumber,
        private readonly SuggestQuoteNumber $suggestQuoteNumber,
        private readonly SuggestCreditNoteNumber $suggestCreditNoteNumber,
    ) {}

    public function show(#[CurrentUser] User $user): InvoicingSettingsData
    {
        return $this->settingsOf($user);
    }

    public function update(UpdateInvoicingSettingsData $data, #[CurrentUser] User $user, UpdateInvoicingSettings $updateInvoicingSettings): InvoicingSettingsData
    {
        $updateInvoicingSettings->handle($user->settingsOrFail(), $data);

        return $this->settingsOf($user);
    }

    private function settingsOf(User $user): InvoicingSettingsData
    {
        return InvoicingSettingsData::fromSettings(
            $user->settingsOrFail(),
            $this->suggestInvoiceNumber->handle($user)->number,
            $this->suggestQuoteNumber->handle($user),
            $this->suggestCreditNoteNumber->handle($user),
        );
    }
}
