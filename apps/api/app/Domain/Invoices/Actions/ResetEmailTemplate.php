<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Users\Models\User;

/** Back to the built-in copy: the account's wording is dropped, not blanked. */
class ResetEmailTemplate
{
    public function __construct(private readonly ResolveEmailTemplate $resolveEmailTemplate) {}

    public function handle(User $user, EmailTemplateKind $kind): EmailTemplateData
    {
        $user->emailTemplates()->where('kind', $kind)->delete();

        return $this->resolveEmailTemplate->handle($user, $kind);
    }
}
