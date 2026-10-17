<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Mail\ClientEmailComposer;
use App\Domain\Invoices\Mail\EmailFigures;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Mailer\Exception\ExceptionInterface as MailerException;
use Symfony\Component\Mime\Exception\ExceptionInterface as MimeException;

/**
 * The e-mail a client would get, sent to the account's own address with
 * sample figures. Handed to the relay during the request, like the mail test:
 * a refusal is the answer, not something to find in a queue log later.
 */
class SendEmailTemplateToMyself
{
    public function __construct(private readonly ResolveEmailTemplate $resolveEmailTemplate) {}

    /**
     * @throws HttpException<409>
     */
    public function handle(User $user, EmailTemplateKind $kind): void
    {
        $content = ClientEmailComposer::compose($user, $this->resolveEmailTemplate->handle($user, $kind), EmailFigures::sample($kind, $user->settingsOrFail()), isTest: true);

        try {
            Mail::to($user->email)->send(new ClientDocumentMail($user, $content));
        } catch (MailerException|MimeException|InvalidArgumentException $exception) {
            throw new HttpException(409, __('client_mail.relay_failed', ['reason' => $exception->getMessage()]), $exception);
        }
    }
}
