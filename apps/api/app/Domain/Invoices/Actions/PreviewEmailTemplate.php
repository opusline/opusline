<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\EmailPreviewData;
use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Data\PreviewEmailTemplateData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Mail\SampleEmailContent;
use App\Domain\Users\Models\User;

class PreviewEmailTemplate
{
    public function __construct(private readonly ResolveEmailTemplate $resolveEmailTemplate) {}

    /** The stored wording, or the draft being typed when one is given: the page previews as it goes. */
    public function handle(User $user, EmailTemplateKind $kind, ?PreviewEmailTemplateData $draft = null): EmailPreviewData
    {
        $template = $this->resolveEmailTemplate->handle($user, $kind);

        if ($draft instanceof PreviewEmailTemplateData) {
            $template = new EmailTemplateData(
                kind: $kind,
                subject: $draft->subject ?? $template->subject,
                body: $draft->body ?? $template->body,
                isCustom: $template->isCustom,
                variables: $template->variables,
            );
        }

        $content = SampleEmailContent::for($user, $template);

        return new EmailPreviewData(
            subject: $content->subject,
            text: implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
            html: new ClientDocumentMail($user, $content)->render(),
        );
    }
}
