<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\EmailPreviewData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Mail\SampleEmailContent;
use App\Domain\Users\Models\User;

class PreviewEmailTemplate
{
    public function __construct(private readonly ResolveEmailTemplate $resolveEmailTemplate) {}

    public function handle(User $user, EmailTemplateKind $kind): EmailPreviewData
    {
        $content = SampleEmailContent::for($user, $this->resolveEmailTemplate->handle($user, $kind));

        return new EmailPreviewData(
            subject: $content->subject,
            text: implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
            html: new ClientDocumentMail($user, $content)->render(),
        );
    }
}
