<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\PreviewEmailTemplate;
use App\Domain\Invoices\Actions\ResetEmailTemplate;
use App\Domain\Invoices\Actions\ResolveEmailTemplate;
use App\Domain\Invoices\Actions\SaveEmailTemplate;
use App\Domain\Invoices\Actions\SendEmailTemplateToMyself;
use App\Domain\Invoices\Actions\UpdateReminderDefaults;
use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Data\EmailTemplatesData;
use App\Domain\Invoices\Data\PreviewEmailTemplateData;
use App\Domain\Invoices\Data\ReminderDefaultsData;
use App\Domain\Invoices\Data\UpdateEmailTemplateData;
use App\Domain\Invoices\Data\UpdateReminderDefaultsData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** The e-mails the account sends its clients, and the words each one uses. */
class EmailTemplateController extends Controller
{
    public function index(#[CurrentUser] User $user, ResolveEmailTemplate $resolveEmailTemplate): EmailTemplatesData
    {
        return new EmailTemplatesData(
            templates: $resolveEmailTemplate->all($user),
            reminderDefaults: ReminderDefaultsData::fromSettings($user->settingsOrFail()),
        );
    }

    public function updateReminderDefaults(UpdateReminderDefaultsData $data, #[CurrentUser] User $user, UpdateReminderDefaults $updateReminderDefaults): ReminderDefaultsData
    {
        return $updateReminderDefaults->handle($user->settingsOrFail(), $data);
    }

    public function update(UpdateEmailTemplateData $data, int $kind, #[CurrentUser] User $user, SaveEmailTemplate $saveEmailTemplate): EmailTemplateData
    {
        return $saveEmailTemplate->handle($user, $this->kind($kind), $data);
    }

    /** Back to the built-in wording. */
    public function destroy(int $kind, #[CurrentUser] User $user, ResetEmailTemplate $resetEmailTemplate): EmailTemplateData
    {
        return $resetEmailTemplate->handle($user, $this->kind($kind));
    }

    /**
     * The e-mail with sample figures, as the client would read it: the stored
     * wording, or the draft sent along. A POST that creates nothing, so a 200.
     */
    public function preview(PreviewEmailTemplateData $draft, int $kind, #[CurrentUser] User $user, PreviewEmailTemplate $previewEmailTemplate): JsonResponse
    {
        return response()->json($previewEmailTemplate->handle($user, $this->kind($kind), $draft));
    }

    /**
     * Sends the sample e-mail to the account's own address.
     *
     * @throws HttpException<409>
     */
    public function test(int $kind, #[CurrentUser] User $user, SendEmailTemplateToMyself $sendEmailTemplateToMyself): Response
    {
        $sendEmailTemplateToMyself->handle($user, $this->kind($kind));

        return response()->noContent();
    }

    /**
     * @throws HttpException<404>
     */
    private function kind(int $kind): EmailTemplateKind
    {
        return EmailTemplateKind::tryFrom($kind) ?? abort(404);
    }
}
