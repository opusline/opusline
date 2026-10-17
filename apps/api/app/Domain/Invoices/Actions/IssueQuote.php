<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Documents\Actions\StoreGeneratedDocument;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Lifecycle\Quote\QuoteSent;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Invoices\Models\QuoteLine;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Validation\ValidationException;

/**
 * Validates a draft into a sent quote: numbered from the quotes' own series,
 * dated today, its validity counted from there, its parties copied as they
 * stand, and its PDF filed with the client's documents. From here the quote
 * is frozen; only its decision still moves.
 */
class IssueQuote
{
    public function __construct(
        private readonly LockQuote $lockQuote,
        private readonly SuggestQuoteNumber $suggestQuoteNumber,
        private readonly RenderQuotePdf $renderQuotePdf,
        private readonly StoreGeneratedDocument $storeGeneratedDocument,
    ) {}

    public function handle(User $user, Quote $quote): Quote
    {
        return $this->lockQuote->handle($quote, function (Quote $locked) use ($user): Quote {
            // A refused or expired quote also goes to Sent, by being reopened: issuing numbers a draft.
            abort_unless(! $locked->status->isIssued() && $locked->lifecycle->canTransitionTo(QuoteSent::class), 409, __('quotes.not_a_draft'));

            $settings = $user->settingsOrFail();
            $locked->load(['client', 'lines']);
            $this->assertIssuable($locked, $settings);

            $issuedOn = $settings->today();

            try {
                $locked->fill([
                    'number' => $this->suggestQuoteNumber->handle($user),
                    'issued_on' => $issuedOn,
                    'valid_until' => $issuedOn->addDays($locked->validity_days),
                    'seller_snapshot' => DocumentParties::seller($settings, false, $locked->show_email),
                    'buyer_snapshot' => DocumentParties::buyer($locked->client),
                ]);
                $locked->lifecycle->transitionTo(QuoteSent::class);
            } catch (UniqueConstraintViolationException) {
                throw ValidationException::withMessages(['number' => __('quotes.number_taken')]);
            }

            $language = $locked->language ?? DocumentLanguage::French;
            $this->storeGeneratedDocument->handle(
                $locked->client,
                $this->renderQuotePdf->handle($locked, $language),
                $this->renderQuotePdf->fileName($locked, $language),
                DocumentCategory::Quote,
                $locked->documentProperties(),
            );

            return $locked;
        });
    }

    private function assertIssuable(Quote $quote, UserSettings $settings): void
    {
        $errors = [];

        if ($quote->lines->isEmpty()) {
            $errors['lines'] = __('quotes.issue_needs_lines');
        } elseif (! $quote->amount_ht_cents->isPositive()) {
            $errors['lines'] = __('quotes.issue_needs_positive_total');
        } elseif (! $settings->vat_regime->isLiable() && $quote->lines->contains(static fn (QuoteLine $line): bool => $line->vat_rate_bp > 0)) {
            $errors['lines'] = __('quotes.issue_needs_vat_rework');
        }

        if (blank($settings->trade_name) || blank($settings->company_address_line1) || blank($settings->company_city)
            || ($settings->hasFrenchFiscality() && blank($settings->siret))) {
            $errors['seller'] = __('quotes.issue_needs_seller_identity');
        }

        if (blank($quote->client->billing_address_line1) || blank($quote->client->billing_city)) {
            $errors['buyer'] = __('quotes.issue_needs_buyer_address');
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }
}
