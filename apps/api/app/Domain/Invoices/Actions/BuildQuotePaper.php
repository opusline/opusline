<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\SaveQuoteDraftData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Documents\PaperBuilder;
use App\Domain\Invoices\Documents\PaperDocument;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\DocumentKind;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Invoices\Models\QuoteLine;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * A quote's printed sheet, the invoice's layout with a validity, a deposit
 * and a signature box. A draft prints the live identity under a stamp; a
 * sent quote prints the parties it went out with.
 *
 * @phpstan-import-type Party from DocumentParties
 */
class BuildQuotePaper
{
    public function __construct(private readonly PaperBuilder $paperBuilder) {}

    public function forQuote(Quote $quote, DocumentLanguage $language): InvoicePaperData
    {
        $quote->loadMissing(['client', 'lines', 'user.settings', 'user.media']);
        $user = $quote->user;
        $settings = $user->settingsOrFail();
        $isIssued = $quote->status->isIssued();

        /** @var Party $seller */
        $seller = $isIssued && $quote->seller_snapshot !== null
            ? $quote->seller_snapshot
            : DocumentParties::seller($settings, false, $quote->show_email);
        /** @var Party $buyer */
        $buyer = $isIssued && $quote->buyer_snapshot !== null
            ? $quote->buyer_snapshot
            : DocumentParties::buyer($quote->client);

        return $this->paperBuilder->build(new PaperDocument(
            kind: DocumentKind::Quote,
            number: $quote->number,
            issuedOn: $quote->issued_on,
            dueOn: null,
            validUntil: $quote->valid_until,
            periodStart: null,
            periodEnd: null,
            title: $quote->title,
            description: $quote->description,
            operationCategory: $settings->operation_category,
            seller: $seller,
            buyer: $buyer,
            lines: array_values($quote->lines->map(static fn (QuoteLine $line): array => [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantity_milli,
                'unit' => $line->unit,
                'unitPrice' => $line->unit_price_cents,
                'vatRateBp' => $line->vat_rate_bp,
            ])->all()),
            currency: $quote->currency,
            term: new PaymentTerm($quote->payment_terms_days, $quote->payment_terms_end_of_month),
            latePenaltyRateBp: null,
            depositRateBp: $quote->deposit_rate_bp,
            showIban: false,
            vatOnDebits: false,
            customMentions: $quote->custom_mentions,
            hasLogo: $user->hasMedia('company_logo'),
        ), new DocumentFormatter($language, $settings->date_format), $isIssued ? null : 'draft');
    }

    /** The sheet of an editor draft that was never saved: the live preview. */
    public function forDraft(User $user, SaveQuoteDraftData $data): InvoicePaperData
    {
        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $vatApplies = $settings->vat_regime->isLiable();
        $issuedOn = $data->issuedOn === null ? $settings->today() : CarbonImmutable::parse($data->issuedOn);
        $lines = [];

        foreach ($data->lines as $line) {
            $lines[] = [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantityMilli,
                'unit' => $line->unit,
                'unitPrice' => $line->unitPrice->toMoney(),
                'vatRateBp' => $vatApplies ? $line->vatRateBp : 0,
            ];
        }

        return $this->paperBuilder->build(new PaperDocument(
            kind: DocumentKind::Quote,
            number: null,
            issuedOn: $issuedOn,
            dueOn: null,
            validUntil: $issuedOn->addDays($data->validityDays),
            periodStart: null,
            periodEnd: null,
            title: $data->title,
            description: $data->description,
            operationCategory: $settings->operation_category,
            seller: DocumentParties::seller($settings, false, $data->showEmail),
            buyer: DocumentParties::buyer($client),
            lines: $lines,
            currency: $settings->currency->value,
            term: new PaymentTerm($data->paymentTermsDays, $data->paymentTermsEndOfMonth),
            latePenaltyRateBp: null,
            depositRateBp: $data->depositRateBp,
            showIban: false,
            vatOnDebits: false,
            customMentions: $data->customMentions,
            hasLogo: $user->hasMedia('company_logo'),
        ), new DocumentFormatter($data->language, $settings->date_format), 'draft');
    }
}
