<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Notifications\TestEmail;
use App\Domain\Users\Models\User;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Mailer\Exception\ExceptionInterface as MailerException;
use Symfony\Component\Mime\Exception\ExceptionInterface as MimeException;
use Throwable;

class SendTestEmail
{
    /**
     * @throws HttpException
     */
    public function handle(User $user): void
    {
        try {
            $user->notifyNow(new TestEmail(isQueued: false));
        } catch (MailerException|MimeException|InvalidArgumentException $exception) {
            // What a wrong MAIL_* value throws: the relay refusing or not
            // answering, an address it cannot be sent from, a mailer that
            // does not exist. A 409, not a 5xx: the instance is being told no
            // about its configuration, which is this endpoint doing its job.
            // The second email would only fail the same way, out of sight.
            throw new HttpException(409, __('mail.test.relay_failed', ['reason' => $exception->getMessage()]), $exception);
        }

        try {
            $user->notify(new TestEmail(isQueued: true));
        } catch (Throwable $exception) {
            // Anything at all: by now the relay is known to work, so whatever
            // stops this email is the queue. That is a fault of the server,
            // reported here because an HttpException is not.
            report($exception);

            throw new HttpException(503, __('mail.test.queue_failed', ['reason' => $exception->getMessage()]), $exception);
        }
    }
}
