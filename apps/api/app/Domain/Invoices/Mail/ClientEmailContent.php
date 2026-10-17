<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Enums\EmailTemplateKind;

/**
 * Everything the client e-mail shows besides the attachment: the subject and
 * body with their placeholders filled, the summary card, the payment block.
 * Built once by whoever sends, so the view never computes anything.
 */
final readonly class ClientEmailContent
{
    /**
     * @param  list<array{label: string, value: string}>  $cardRows
     * @param  ?array{iban: string, bic: ?string, reference: string}  $payment
     */
    public function __construct(
        public EmailTemplateKind $kind,
        public string $locale,
        public string $subject,
        public string $body,
        public string $cardTitle,
        public ?string $cardSubtitle,
        public array $cardRows,
        public ?array $payment,
        /** Set on a test send to the account itself, so the e-mail says so. */
        public bool $isTest = false,
    ) {}
}
