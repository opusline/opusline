<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\ComposeDocumentEmail;
use App\Domain\Invoices\Actions\SendInvoiceEmail;
use App\Domain\Invoices\Data\DocumentEmailData;
use App\Domain\Invoices\Data\EmailPreviewData;
use App\Domain\Invoices\Data\PreviewEmailTemplateData;
use App\Domain\Invoices\Data\SendInvoiceEmailData;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** An invoice on its way to the client by e-mail. */
class InvoiceEmailController extends Controller
{
    /** The e-mail this invoice would go out in, with the wording typed so far. A POST that creates nothing, so a 200. */
    public function preview(PreviewEmailTemplateData $draft, Invoice $invoice, #[CurrentUser] User $user, ComposeDocumentEmail $composeDocumentEmail): JsonResponse
    {
        $content = $composeDocumentEmail->forInvoice($user, $invoice, $draft->subject, $draft->body);

        return response()->json(new EmailPreviewData(
            subject: $content->subject,
            text: implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
            html: new ClientDocumentMail($user, $content)->render(),
        ));
    }

    /**
     * @throws HttpException<409>
     */
    public function send(SendInvoiceEmailData $data, Invoice $invoice, #[CurrentUser] User $user, SendInvoiceEmail $sendInvoiceEmail): JsonResponse
    {
        return response()->json(DocumentEmailData::fromModel($sendInvoiceEmail->handle($user, $invoice, $data)), 201);
    }

    /** The same e-mail, to the account's own address, nothing recorded. */
    public function test(PreviewEmailTemplateData $draft, Invoice $invoice, #[CurrentUser] User $user, ComposeDocumentEmail $composeDocumentEmail): Response
    {
        $content = $composeDocumentEmail->forInvoice($user, $invoice, $draft->subject, $draft->body, isTest: true);
        Mail::to($user->email)->send(new ClientDocumentMail($user, $content));

        return response()->noContent();
    }
}
