<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * A template filled with invented figures, for the preview and the test
 * send: a fictional client, a round amount, dates counted from today.
 */
final class SampleEmailContent
{
    private const int SAMPLE_AMOUNT_CENTS = 144_000;

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
        $amount = $format->money(new Money(self::SAMPLE_AMOUNT_CENTS, $settings->currency->value));
        $contact = $settings->trade_name ?? $user->name;
        $title = self::text('client_mail.sample.title', $locale);

        $values = match ($kind) {
            EmailTemplateKind::NewInvoice => [
                'numero' => $number,
                'titre' => $title,
                'montant' => $amount,
                'echeance' => $format->date($today->addDays(self::SAMPLE_TERM_DAYS)),
            ],
            EmailTemplateKind::NewQuote => [
                'numero' => $number,
                'titre' => $title,
                'montant' => $amount,
                'validite' => $format->date($today->addDays(self::SAMPLE_TERM_DAYS)),
            ],
            EmailTemplateKind::CreditNote => [
                'numero' => $number,
                'facture' => self::text('client_mail.sample.cancelled_invoice', $locale),
                'montant' => $amount,
                'traitement' => self::text('client_mail.treatment.cancelled', $locale),
            ],
            EmailTemplateKind::PaymentReminder => [
                'numero' => $number,
                'montant' => $amount,
                'echeance' => $format->date($today->subDays(self::SAMPLE_LATE_DAYS)),
                'retard' => trans_choice('client_mail.late', self::SAMPLE_LATE_DAYS, [], $locale),
            ],
        };
        $values += [
            'client' => self::text('client_mail.sample.client', $locale),
            'contact' => $contact,
        ];

        $rows = [['label' => self::text('client_mail.card.amount', $locale), 'value' => $amount]];

        if (isset($values['echeance'])) {
            $rows[] = ['label' => self::text('client_mail.card.due', $locale), 'value' => $values['echeance']];
        }

        if (isset($values['validite'])) {
            $rows[] = ['label' => self::text('client_mail.card.validity', $locale), 'value' => $values['validite']];
        }

        return new ClientEmailContent(
            kind: $kind,
            locale: $locale,
            subject: TemplateVariables::fill($template->subject, $values),
            body: TemplateVariables::fill($template->body, $values),
            cardTitle: (string) __("client_mail.card.{$kind->langKey()}", ['number' => $number], $locale),
            cardSubtitle: $kind === EmailTemplateKind::CreditNote ? null : $title,
            cardRows: $rows,
            payment: self::payment($settings, $kind, $number, $locale),
            isTest: $isTest,
        );
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
    private static function payment(UserSettings $settings, EmailTemplateKind $kind, string $number, string $locale): ?array
    {
        $asksForMoney = in_array($kind, [EmailTemplateKind::NewInvoice, EmailTemplateKind::PaymentReminder], true);

        if (! $asksForMoney || ! $settings->show_iban_on_invoices || $settings->iban === null) {
            return null;
        }

        return [
            'iban' => $settings->iban,
            'bic' => $settings->bic,
            'reference' => (string) __('client_mail.payment.reference', ['number' => $number], $locale),
        ];
    }

    private static function text(string $key, string $locale): string
    {
        return (string) __($key, [], $locale);
    }
}
