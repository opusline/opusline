<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\SendInvoiceEmailData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * E-mails an issued invoice to the client, its PDF attached, and keeps the
 * trace: the e-mail as it left, an entry in the invoice's history, and the
 * reminder settings the invoice will live by. Only an invoice written in
 * Opusline goes out this way: one recorded from another tool was sent by
 * that tool.
 */
class SendInvoiceEmail
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly ComposeDocumentEmail $composeDocumentEmail,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(User $user, Invoice $invoice, SendInvoiceEmailData $data): DocumentEmail
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($user, $data): DocumentEmail {
            abort_if(! $locked->isWrittenInOpusline(), 409, __('client_mail.written_elsewhere'));
            abort_if($locked->status === InvoiceStatus::Draft, 409, __('client_mail.validate_before_sending'));

            $document = $locked->attachedDocument();
            abort_if(! $document instanceof Media, 409, __('client_mail.no_document'));

            $settings = $user->settingsOrFail();
            $content = $this->composeDocumentEmail->forInvoice($user, $locked, $data->subject, $data->body);
            $today = $settings->today();

            $locked->update([
                'reminders_enabled' => $data->remindersEnabled ?? $settings->reminders_default_enabled,
                'reminders_frequency' => $data->remindersFrequency ?? $settings->reminders_default_frequency,
                'reminder_recipients' => $data->recipients,
            ]);

            $email = $locked->emails()->create([
                'user_id' => $user->id,
                'kind' => EmailTemplateKind::NewInvoice,
                'recipients' => $data->recipients,
                'copy_to_sender' => $data->copyToSender,
                'subject' => $content->subject,
                'body' => implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
                'sent_at' => now(),
            ]);

            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Emailed, $today, implode(', ', $data->recipients));

            $mail = Mail::to($data->recipients);

            if ($data->copyToSender) {
                $mail->cc($user->email);
            }

            $mail->queue(new ClientDocumentMail($user, $content, [[
                'disk' => $document->disk,
                'path' => $document->getPathRelativeToRoot(),
                'name' => $document->file_name,
            ]]));

            return $email;
        });
    }
}
