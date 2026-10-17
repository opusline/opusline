<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Models\EmailTemplate;
use Spatie\LaravelData\Data;

/** One client e-mail as the account sends it: its own wording, or the built-in default. */
class EmailTemplateData extends Data
{
    /**
     * @param  list<string>  $variables  The `{name}` placeholders this kind accepts.
     */
    public function __construct(
        public EmailTemplateKind $kind,
        public string $subject,
        public string $body,
        /** Reworded by the account; false means the default copy in the account's document language. */
        public bool $isCustom,
        public array $variables,
    ) {}

    public static function fromModel(EmailTemplate $template): self
    {
        return new self(
            kind: $template->kind,
            subject: $template->subject,
            body: $template->body,
            isCustom: true,
            variables: $template->kind->variables(),
        );
    }

    public static function fromDefault(EmailTemplateKind $kind, string $locale): self
    {
        return new self(
            kind: $kind,
            subject: __("client_mail.templates.{$kind->langKey()}.subject", [], $locale),
            body: __("client_mail.templates.{$kind->langKey()}.body", [], $locale),
            isCustom: false,
            variables: $kind->variables(),
        );
    }
}
