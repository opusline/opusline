<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\PreviewEmailTemplateData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Reminds the client of an unpaid invoice: the « Relance de paiement »
 * template, the PDF attached again, to the addresses the invoice went out
 * to. The same door whether the schedule or a click opens it.
 */
class SendPaymentReminder
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly ComposeDocumentEmail $composeDocumentEmail,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(User $user, Invoice $invoice, ?PreviewEmailTemplateData $wording = null): DocumentEmail
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($user, $wording): DocumentEmail {
            abort_if(! $locked->status->canBeReminded(), 409, __('invoices.cannot_remind'));

            $recipients = $locked->reminder_recipients ?? [];
            abort_if($recipients === [], 409, __('client_mail.no_reminder_recipients'));

            $document = $locked->attachedDocument();
            abort_if(! $document instanceof Media, 409, __('client_mail.no_document'));

            $content = $this->composeDocumentEmail->forInvoice($user, $locked, $wording?->subject, $wording?->body, kind: EmailTemplateKind::PaymentReminder);

            $email = $locked->emails()->create([
                'user_id' => $user->id,
                'kind' => EmailTemplateKind::PaymentReminder,
                'recipients' => $recipients,
                'copy_to_sender' => false,
                'subject' => $content->subject,
                'body' => implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
                'sent_at' => now(),
            ]);

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Reminded, $user->settingsOrFail()->today(), implode(', ', $recipients));

            Mail::to($recipients)->queue(new ClientDocumentMail($user, $content, [[
                'disk' => $document->disk,
                'path' => $document->getPathRelativeToRoot(),
                'name' => $document->file_name,
            ]]));

            return $email;
        });
    }
}
