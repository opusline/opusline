<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Models\DocumentEmail;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** One e-mail a document was sent in, as the history shows it. */
class DocumentEmailData extends Data
{
    /**
     * @param  list<string>  $recipients
     */
    public function __construct(
        public int $id,
        public EmailTemplateKind $kind,
        public array $recipients,
        public bool $copyToSender,
        public string $subject,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: DATE_ATOM)]
        public CarbonImmutable $sentAt,
    ) {}

    public static function fromModel(DocumentEmail $email): self
    {
        return new self(
            id: $email->id,
            kind: $email->kind,
            recipients: $email->recipients,
            copyToSender: $email->copy_to_sender,
            subject: $email->subject,
            sentAt: $email->sent_at,
        );
    }
}
