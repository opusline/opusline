<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\SendPaymentReminder;
use App\Domain\Invoices\Actions\UpdateInvoiceReminders;
use App\Domain\Invoices\Data\DocumentEmailData;
use App\Domain\Invoices\Data\InvoiceDetailData;
use App\Domain\Invoices\Data\PreviewEmailTemplateData;
use App\Domain\Invoices\Data\UpdateInvoiceRemindersData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\NetIncome;
use App\Domain\Settings\Rates\ContributionRateHistory;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** The automatic reminders of one unpaid invoice: their setting, and one sent right now. */
class InvoiceReminderController extends Controller
{
    public function __construct(private readonly ContributionRateHistory $contributionRateHistory) {}

    /**
     * @throws HttpException<409>
     */
    public function update(UpdateInvoiceRemindersData $data, Invoice $invoice, UpdateInvoiceReminders $updateInvoiceReminders): InvoiceDetailData
    {
        $invoice = $updateInvoiceReminders->handle($invoice, $data)->load(['client', 'mission', 'events', 'lines', 'quote', 'emails', 'payments', 'creditNotes', 'deductedCreditNotes', 'user.settings', ...NetIncome::INVOICE_RELATIONS]);

        return InvoiceDetailData::fromModel(
            $invoice,
            NetIncome::forAccount($invoice->user->settingsOrFail(), $this->contributionRateHistory),
        );
    }

    /**
     * « Relancer maintenant »: the payment-reminder e-mail, to the addresses the invoice went out to.
     *
     * @throws HttpException<409>
     */
    public function send(PreviewEmailTemplateData $wording, Invoice $invoice, #[CurrentUser] User $user, SendPaymentReminder $sendPaymentReminder): JsonResponse
    {
        return response()->json(DocumentEmailData::fromModel($sendPaymentReminder->handle($user, $invoice, $wording)), 201);
    }
}
