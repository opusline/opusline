<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Enums\EmailTemplateKind;

/**
 * Everything the client e-mail shows besides the attachment, laid out as the
 * design (InvoiceEmail canvas) reads it: a greeting and paragraphs, a summary
 * card with its amount, flag and rows, how to pay, the signature. Built once
 * by whoever sends, so the view never computes anything.
 */
final readonly class ClientEmailContent
{
    /**
     * @param  list<string>  $paragraphs  The body after the greeting, one entry per blank-line-separated block.
     * @param  ?array{label: string, tone: 'late'|'quiet'}  $flag  The badge beside the amount.
     * @param  list<array{label: string, value: string}>  $rows
     * @param  ?array{iban: string, bic: ?string, reference: string}  $payment
     * @param  list<string>  $signature  The lines under the sender's name.
     */
    public function __construct(
        public EmailTemplateKind $kind,
        public string $locale,
        public string $subject,
        public string $greeting,
        public array $paragraphs,
        public string $cardLabel,
        public string $amount,
        public ?array $flag,
        public array $rows,
        public string $attachmentName,
        public ?array $payment,
        public string $senderName,
        public array $signature,
        public string $footer,
        /** Set on a test send to the account itself, so the e-mail says so. */
        public bool $isTest = false,
    ) {}

    /**
     * The design greets on its own line: the first block is the greeting when
     * it opens like one, else the greeting is left to the body.
     *
     * @return array{string, list<string>}
     */
    public static function splitGreeting(string $body): array
    {
        $blocks = array_values(array_filter(array_map(trim(...), preg_split('/\n\s*\n/', $body) ?: []), static fn (string $block): bool => $block !== ''));

        if ($blocks !== [] && preg_match('/^(bonjour|hello|hi|madame|monsieur|cher|chère|dear)\b/iu', $blocks[0]) === 1) {
            return [array_shift($blocks), $blocks];
        }

        return ['', $blocks];
    }
}
