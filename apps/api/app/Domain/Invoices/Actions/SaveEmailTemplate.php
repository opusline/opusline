<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Data\UpdateEmailTemplateData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\TemplateVariables;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

class SaveEmailTemplate
{
    public function handle(User $user, EmailTemplateKind $kind, UpdateEmailTemplateData $data): EmailTemplateData
    {
        $this->assertKnownVariables($kind, ['subject' => $data->subject, 'body' => $data->body]);

        $template = $user->emailTemplates()->updateOrCreate(
            ['kind' => $kind],
            ['subject' => trim($data->subject), 'body' => trim($data->body)],
        );

        return EmailTemplateData::fromModel($template);
    }

    /**
     * A placeholder this kind cannot fill would reach the client as typed:
     * refused on the field that carries it.
     *
     * @param  array<string, string>  $fields
     */
    private function assertKnownVariables(EmailTemplateKind $kind, array $fields): void
    {
        $errors = [];

        foreach ($fields as $field => $text) {
            $unknown = TemplateVariables::unknown($text, $kind);

            if ($unknown !== []) {
                $errors[$field] = __('client_mail.unknown_variable', [
                    'name' => '{'.$unknown[0].'}',
                    'known' => implode(', ', array_map(static fn (string $name): string => '{'.$name.'}', $kind->variables())),
                ]);
            }
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }
}
