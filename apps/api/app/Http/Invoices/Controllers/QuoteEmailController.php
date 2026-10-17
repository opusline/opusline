<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\ComposeDocumentEmail;
use App\Domain\Invoices\Actions\SendQuoteEmail;
use App\Domain\Invoices\Data\DocumentEmailData;
use App\Domain\Invoices\Data\EmailPreviewData;
use App\Domain\Invoices\Data\PreviewEmailTemplateData;
use App\Domain\Invoices\Data\SendDocumentEmailData;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** A quote on its way to the client by e-mail. */
class QuoteEmailController extends Controller
{
    /** The e-mail this quote would go out in, with the wording typed so far. A POST that creates nothing, so a 200. */
    public function preview(PreviewEmailTemplateData $draft, Quote $quote, #[CurrentUser] User $user, ComposeDocumentEmail $composeDocumentEmail): JsonResponse
    {
        $content = $composeDocumentEmail->forQuote($user, $quote, $draft->subject, $draft->body);

        return response()->json(new EmailPreviewData(
            subject: $content->subject,
            text: implode("\n\n", array_values(array_filter([$content->greeting, ...$content->paragraphs], static fn (string $block): bool => $block !== ''))),
            html: new ClientDocumentMail($user, $content)->render(),
        ));
    }

    /**
     * @throws HttpException<409>
     */
    public function send(SendDocumentEmailData $data, Quote $quote, #[CurrentUser] User $user, SendQuoteEmail $sendQuoteEmail): JsonResponse
    {
        return response()->json(DocumentEmailData::fromModel($sendQuoteEmail->handle($user, $quote, $data)), 201);
    }

    /** The same e-mail, to the account's own address, nothing recorded. */
    public function test(PreviewEmailTemplateData $draft, Quote $quote, #[CurrentUser] User $user, ComposeDocumentEmail $composeDocumentEmail): Response
    {
        $content = $composeDocumentEmail->forQuote($user, $quote, $draft->subject, $draft->body, isTest: true);
        Mail::to($user->email)->send(new ClientDocumentMail($user, $content));

        return response()->noContent();
    }
}
