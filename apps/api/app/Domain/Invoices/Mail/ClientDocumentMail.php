<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Users\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * An e-mail from the account to one of its clients, carrying a document.
 *
 * It leaves from the instance's own sender, signed with the account's name,
 * and replies go to the account's contact address: the instance is the
 * postman, the freelance is the correspondent.
 */
class ClientDocumentMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    /**
     * @param  list<Attachment>  $documents  The PDFs that ride along; the test send carries none.
     */
    public function __construct(
        public readonly User $sender,
        public readonly ClientEmailContent $content,
        private readonly array $documents = [],
    ) {}

    public function envelope(): Envelope
    {
        $settings = $this->sender->settingsOrFail();

        return new Envelope(
            from: new Address(config()->string('mail.from.address'), self::headerSafe($settings->trade_name ?? $this->sender->name)),
            replyTo: [new Address($settings->contact_email ?? $this->sender->email)],
            subject: self::headerSafe($this->content->subject),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.client-document',
            with: [
                'sender' => $this->sender,
                'content' => $this->content,
                'logo' => $this->sender->getFirstMedia('company_logo'),
                'initials' => self::initials($this->sender->settingsOrFail()->trade_name ?? $this->sender->name),
            ],
        );
    }

    /**
     * @return list<Attachment>
     */
    public function attachments(): array
    {
        return $this->documents;
    }

    /**
     * A line break in a header is a second header: a display name or a
     * subject typed by the account must never carry one.
     */
    public static function headerSafe(string $value): string
    {
        return trim((string) preg_replace('/[\r\n]+/', ' ', $value));
    }

    /** « Théo Marchand » → « TM »: what stands in for a logo nobody uploaded. */
    public static function initials(string $name): string
    {
        $words = preg_split('/[\s\-]+/u', trim($name), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $letters = array_map(static fn (string $word): string => mb_strtoupper(mb_substr($word, 0, 1)), array_slice($words, 0, 2));

        return implode('', $letters);
    }
}
