<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\SendDocumentEmailData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/** E-mails a validated quote to the client, its PDF attached, and keeps the e-mail as it left. */
class SendQuoteEmail
{
    public function __construct(
        private readonly LockQuote $lockQuote,
        private readonly ComposeDocumentEmail $composeDocumentEmail,
    ) {}

    public function handle(User $user, Quote $quote, SendDocumentEmailData $data): DocumentEmail
    {
        return $this->lockQuote->handle($quote, function (Quote $locked) use ($user, $data): DocumentEmail {
            abort_if(! $locked->isWrittenInOpusline(), 409, __('client_mail.written_elsewhere'));
            abort_if(! $locked->status->isIssued(), 409, __('client_mail.validate_before_sending'));

            $document = $locked->attachedDocument();
            abort_if(! $document instanceof Media, 409, __('client_mail.no_document'));

            $content = $this->composeDocumentEmail->forQuote($user, $locked, $data->subject, $data->body);

            $email = $locked->emails()->create([
                'user_id' => $user->id,
                'kind' => EmailTemplateKind::NewQuote,
                'recipients' => $data->recipients,
                'copy_to_sender' => $data->copyToSender,
                'subject' => $content->subject,
                'body' => implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
                'sent_at' => now(),
            ]);

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
