<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\LatePayment\LegalReference;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * A template filled with invented figures, for the preview and the test
 * send: a fictional client, round amounts, dates counted from today.
 */
final class SampleEmailContent
{
    private const int SAMPLE_HT_CENTS = 120_000;

    private const int SAMPLE_TTC_CENTS = 144_000;

    private const int SAMPLE_TERM_DAYS = 30;

    private const int SAMPLE_LATE_DAYS = 12;

    public static function for(User $user, EmailTemplateData $template, bool $isTest = false): ClientEmailContent
    {
        $settings = $user->settingsOrFail();
        $locale = $settings->document_language->locale();
        $format = new DocumentFormatter($settings->document_language, $settings->date_format);
        $today = $settings->today();
        $kind = $template->kind;
        $number = self::sampleNumber($kind);
        $currency = $settings->currency->value;
        $ht = $format->money(new Money(self::SAMPLE_HT_CENTS, $currency));
        $ttc = $format->money(new Money(self::SAMPLE_TTC_CENTS, $currency));
        $title = self::text('client_mail.sample.title', $locale);
        $dueOn = $format->date($today->addDays(self::SAMPLE_TERM_DAYS));
        $overdueOn = $format->date($today->subDays(self::SAMPLE_LATE_DAYS));
        $penaltyRateBp = $settings->late_penalty_rate_bp ?? LegalReference::current()->statutoryPenaltyRateBp();

        $values = match ($kind) {
            EmailTemplateKind::NewInvoice => ['numero' => $number, 'titre' => $title, 'montant' => $ttc, 'echeance' => $dueOn],
            EmailTemplateKind::NewQuote => ['numero' => $number, 'titre' => $title, 'montant' => $ht, 'validite' => $dueOn],
            EmailTemplateKind::CreditNote => [
                'numero' => $number,
                'facture' => self::text('client_mail.sample.cancelled_invoice', $locale),
                'montant' => $ttc,
                'traitement' => self::text('client_mail.treatment.cancelled', $locale),
            ],
            EmailTemplateKind::PaymentReminder => [
                'numero' => $number,
                'titre' => $title,
                'montant' => $ttc,
                'echeance' => $overdueOn,
                'retard' => (string) self::SAMPLE_LATE_DAYS,
                'penalites' => $format->rate($penaltyRateBp),
            ],
        };
        $values += [
            'contact' => self::text('client_mail.sample.contact', $locale),
            'client' => self::text('client_mail.sample.client', $locale),
        ];

        [$greeting, $paragraphs] = ClientEmailContent::splitGreeting(TemplateVariables::fill($template->body, $values));
        $senderName = $settings->trade_name ?? $user->name;
        $senderEmail = $settings->contact_email ?? $user->email;

        return new ClientEmailContent(
            kind: $kind,
            locale: $locale,
            subject: TemplateVariables::fill($template->subject, $values),
            greeting: $greeting,
            paragraphs: $paragraphs,
            cardLabel: (string) __("client_mail.card.{$kind->langKey()}", ['number' => $number], $locale),
            amount: match ($kind) {
                EmailTemplateKind::NewQuote => $ht,
                EmailTemplateKind::CreditNote => '− '.$ttc,
                default => $ttc,
            },
            flag: match ($kind) {
                EmailTemplateKind::PaymentReminder => ['label' => (string) __('client_mail.card.late', ['days' => self::SAMPLE_LATE_DAYS], $locale), 'tone' => 'late'],
                EmailTemplateKind::NewQuote => ['label' => (string) __('client_mail.card.valid_until', ['date' => $dueOn], $locale), 'tone' => 'quiet'],
                default => null,
            },
            rows: self::rows($kind, $locale, $title, $number, $ht, $ttc, $dueOn, $overdueOn),
            attachmentName: $number.'.pdf',
            payment: self::payment($settings, $kind, $number),
            senderName: $senderName,
            signature: array_values(array_filter([
                $settings->siret === null ? null : (string) __('client_mail.signature.siret', ['name' => $senderName, 'siret' => $settings->siret], $locale),
                $senderEmail,
            ])),
            footer: (string) __('client_mail.footer', ['name' => $senderName, 'email' => $senderEmail], $locale),
            isTest: $isTest,
        );
    }

    /**
     * @return list<array{label: string, value: string}>
     */
    private static function rows(EmailTemplateKind $kind, string $locale, string $title, string $number, string $ht, string $ttc, string $dueOn, string $overdueOn): array
    {
        $pairs = match ($kind) {
            EmailTemplateKind::NewInvoice => [['subject', $title], ['due', $dueOn], ['transfer_reference', $number]],
            EmailTemplateKind::NewQuote => [['subject', $title], ['amount_ht', $ht], ['amount_ttc', $ttc]],
            EmailTemplateKind::CreditNote => [
                ['original_invoice', self::text('client_mail.sample.cancelled_invoice', $locale)],
                ['reason', self::text('client_mail.sample.reason', $locale)],
                ['treatment', self::text('client_mail.sample.treatment_short', $locale)],
            ],
            EmailTemplateKind::PaymentReminder => [['subject', $title], ['due_passed', $overdueOn], ['transfer_reference', $number]],
        };

        return array_map(static fn (array $pair): array => [
            'label' => self::text("client_mail.card.{$pair[0]}", $locale),
            'value' => $pair[1],
        ], $pairs);
    }

    private static function sampleNumber(EmailTemplateKind $kind): string
    {
        return match ($kind) {
            EmailTemplateKind::NewInvoice, EmailTemplateKind::PaymentReminder => 'F-2026-014',
            EmailTemplateKind::NewQuote => 'D-2026-003',
            EmailTemplateKind::CreditNote => 'A-2026-002',
        };
    }

    /**
     * The transfer details, on the e-mails that ask for money and only when
     * the account prints them on its invoices.
     *
     * @return ?array{iban: string, bic: ?string, reference: string}
     */
    private static function payment(UserSettings $settings, EmailTemplateKind $kind, string $number): ?array
    {
        if (! $kind->asksForPayment() || ! $settings->show_iban_on_invoices || $settings->iban === null) {
            return null;
        }

        return ['iban' => $settings->iban, 'bic' => $settings->bic, 'reference' => $number];
    }

    private static function text(string $key, string $locale): string
    {
        return (string) __($key, [], $locale);
    }
}
