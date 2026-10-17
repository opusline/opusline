<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Models\EmailTemplate;
use App\Domain\Users\Models\User;

/**
 * The wording an account sends for one kind of e-mail: its own if it reworded
 * it, else the built-in copy in the language its documents are written in.
 */
class ResolveEmailTemplate
{
    public function handle(User $user, EmailTemplateKind $kind): EmailTemplateData
    {
        $custom = $user->emailTemplates()->where('kind', $kind)->first();

        if ($custom !== null) {
            return EmailTemplateData::fromModel($custom);
        }

        return EmailTemplateData::fromDefault($kind, $user->settingsOrFail()->document_language->locale());
    }

    /**
     * @return list<EmailTemplateData>
     */
    public function all(User $user): array
    {
        $custom = $user->emailTemplates()->get()->keyBy(static fn (EmailTemplate $template): int => $template->kind->value);
        $locale = $user->settingsOrFail()->document_language->locale();
        $templates = [];

        foreach (EmailTemplateKind::cases() as $kind) {
            $reworded = $custom->get($kind->value);
            $templates[] = $reworded instanceof EmailTemplate
                ? EmailTemplateData::fromModel($reworded)
                : EmailTemplateData::fromDefault($kind, $locale);
        }

        return $templates;
    }
}
