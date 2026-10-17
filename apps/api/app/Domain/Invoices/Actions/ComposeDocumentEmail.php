<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\ClientEmailComposer;
use App\Domain\Invoices\Mail\ClientEmailContent;
use App\Domain\Invoices\Mail\EmailFigures;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;

/**
 * The e-mail a document goes out in: the account's template for that kind,
 * reworded for this send when the page did, filled with the document's own
 * figures.
 */
class ComposeDocumentEmail
{
    public function __construct(private readonly ResolveEmailTemplate $resolveEmailTemplate) {}

    /** As a new invoice, or as a payment reminder once past due. */
    public function forInvoice(User $user, Invoice $invoice, ?string $subject = null, ?string $body = null, bool $isTest = false, EmailTemplateKind $kind = EmailTemplateKind::NewInvoice): ClientEmailContent
    {
        $invoice->loadMissing('client');

        return ClientEmailComposer::compose(
            $user,
            $this->template($user, $kind, $subject, $body),
            EmailFigures::forInvoice($invoice, $kind, $user->settingsOrFail()),
            $isTest,
        );
    }

    public function forQuote(User $user, Quote $quote, ?string $subject = null, ?string $body = null, bool $isTest = false): ClientEmailContent
    {
        $quote->loadMissing('client');

        return ClientEmailComposer::compose(
            $user,
            $this->template($user, EmailTemplateKind::NewQuote, $subject, $body),
            EmailFigures::forQuote($quote, $user->settingsOrFail()),
            $isTest,
        );
    }

    private function template(User $user, EmailTemplateKind $kind, ?string $subject, ?string $body): EmailTemplateData
    {
        $stored = $this->resolveEmailTemplate->handle($user, $kind);

        if ($subject === null && $body === null) {
            return $stored;
        }

        return new EmailTemplateData(
            kind: $kind,
            subject: $subject ?? $stored->subject,
            body: $body ?? $stored->body,
            isCustom: $stored->isCustom,
            variables: $stored->variables,
        );
    }
}
