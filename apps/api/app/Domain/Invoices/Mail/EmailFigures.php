<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\LatePayment\LegalReference;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Settings\Models\UserSettings;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * What a client e-mail says about its document: the figures the placeholders
 * and the summary card are filled from, whether they come from a real invoice
 * or quote or are invented for a preview.
 */
final readonly class EmailFigures
{
    private const int SAMPLE_HT_CENTS = 120_000;

    private const int SAMPLE_TTC_CENTS = 144_000;

    private const int SAMPLE_TERM_DAYS = 30;

    private const int SAMPLE_LATE_DAYS = 12;

    public function __construct(
        public EmailTemplateKind $kind,
        public string $number,
        public ?string $title,
        public Money $amountHt,
        public Money $amountTtc,
        public ?CarbonImmutable $dueOn,
        public ?CarbonImmutable $validUntil,
        public int $lateDays,
        public int $penaltyRateBp,
        /** The person greeted: the client's contact, or the client itself. */
        public string $contact,
        public string $client,
        public ?string $cancelledInvoice = null,
        public ?string $treatment = null,
        public ?string $reason = null,
        public ?string $treatmentShort = null,
    ) {}

    public static function sample(EmailTemplateKind $kind, UserSettings $settings): self
    {
        $locale = $settings->document_language->locale();
        $today = $settings->today();
        $currency = $settings->currency->value;
        $isReminder = $kind === EmailTemplateKind::PaymentReminder;

        return new self(
            kind: $kind,
            number: match ($kind) {
                EmailTemplateKind::NewInvoice, EmailTemplateKind::PaymentReminder => 'F-2026-014',
                EmailTemplateKind::NewQuote => 'D-2026-003',
                EmailTemplateKind::CreditNote => 'A-2026-002',
            },
            title: (string) __('client_mail.sample.title', [], $locale),
            amountHt: new Money(self::SAMPLE_HT_CENTS, $currency),
            amountTtc: new Money(self::SAMPLE_TTC_CENTS, $currency),
            dueOn: $isReminder ? $today->subDays(self::SAMPLE_LATE_DAYS) : $today->addDays(self::SAMPLE_TERM_DAYS),
            validUntil: $today->addDays(self::SAMPLE_TERM_DAYS),
            lateDays: $isReminder ? self::SAMPLE_LATE_DAYS : 0,
            penaltyRateBp: self::penaltyRateBp($settings),
            contact: (string) __('client_mail.sample.contact', [], $locale),
            client: (string) __('client_mail.sample.client', [], $locale),
            cancelledInvoice: (string) __('client_mail.sample.cancelled_invoice', [], $locale),
            treatment: (string) __('client_mail.treatment.cancelled', [], $locale),
            reason: (string) __('client_mail.sample.reason', [], $locale),
            treatmentShort: (string) __('client_mail.sample.treatment_short', [], $locale),
        );
    }

    /** An issued invoice, as a new invoice or, once past due, as a reminder. */
    public static function forInvoice(Invoice $invoice, EmailTemplateKind $kind, UserSettings $settings): self
    {
        $today = $settings->today();

        return new self(
            kind: $kind,
            number: (string) $invoice->number,
            title: $invoice->title,
            amountHt: $invoice->amount_ht_cents,
            amountTtc: $invoice->amount_ttc_cents,
            dueOn: $invoice->due_on,
            validUntil: null,
            lateDays: $today->greaterThan($invoice->due_on) ? (int) abs($invoice->due_on->diffInDays($today)) : 0,
            penaltyRateBp: $invoice->late_penalty_rate_bp ?? self::penaltyRateBp($settings),
            contact: $invoice->client->billing_contact_name ?? $invoice->client->name,
            client: $invoice->client->name,
        );
    }

    public static function forQuote(Quote $quote, UserSettings $settings): self
    {
        return new self(
            kind: EmailTemplateKind::NewQuote,
            number: (string) $quote->number,
            title: $quote->title,
            amountHt: $quote->amount_ht_cents,
            amountTtc: $quote->amount_ttc_cents,
            dueOn: null,
            validUntil: $quote->valid_until,
            lateDays: 0,
            penaltyRateBp: self::penaltyRateBp($settings),
            contact: $quote->client->billing_contact_name ?? $quote->client->name,
            client: $quote->client->name,
        );
    }

    private static function penaltyRateBp(UserSettings $settings): int
    {
        return $settings->late_penalty_rate_bp ?? LegalReference::current()->statutoryPenaltyRateBp();
    }
}
