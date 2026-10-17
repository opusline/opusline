<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Mail;

use App\Domain\Invoices\Data\EmailTemplateData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * Turns a template and a document's figures into the e-mail as the client
 * reads it: placeholders filled, the greeting split off, the summary card
 * and the payment block laid out the way the design does.
 */
final class ClientEmailComposer
{
    public static function compose(User $user, EmailTemplateData $template, EmailFigures $figures, bool $isTest = false): ClientEmailContent
    {
        $settings = $user->settingsOrFail();
        $locale = $settings->document_language->locale();
        $format = new DocumentFormatter($settings->document_language, $settings->date_format);
        $kind = $figures->kind;
        $ht = $format->money($figures->amountHt);
        $ttc = $format->money($figures->amountTtc);
        $title = $figures->title ?? $figures->number;
        $dueOn = $figures->dueOn instanceof CarbonImmutable ? $format->date($figures->dueOn) : '';
        $validUntil = $figures->validUntil instanceof CarbonImmutable ? $format->date($figures->validUntil) : '';

        $values = [
            'numero' => $figures->number,
            'titre' => $title,
            'montant' => $kind === EmailTemplateKind::NewQuote ? $ht : $ttc,
            'echeance' => $dueOn,
            'validite' => $validUntil,
            'retard' => (string) $figures->lateDays,
            'penalites' => $format->rate($figures->penaltyRateBp),
            'facture' => $figures->cancelledInvoice ?? '',
            'traitement' => $figures->treatment ?? '',
            'contact' => $figures->contact,
            'client' => $figures->client,
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
            cardLabel: (string) __("client_mail.card.{$kind->langKey()}", ['number' => $figures->number], $locale),
            amount: match ($kind) {
                EmailTemplateKind::NewQuote => $ht,
                EmailTemplateKind::CreditNote => '− '.$ttc,
                default => $ttc,
            },
            flag: match ($kind) {
                EmailTemplateKind::PaymentReminder => ['label' => (string) __('client_mail.card.late', ['days' => $figures->lateDays], $locale), 'tone' => 'late'],
                EmailTemplateKind::NewQuote => ['label' => (string) __('client_mail.card.valid_until', ['date' => $validUntil], $locale), 'tone' => 'quiet'],
                default => null,
            },
            rows: self::rows($figures, $locale, $title, $ht, $ttc, $dueOn),
            attachmentName: $figures->number.'.pdf',
            payment: self::payment($settings, $kind, $figures->number),
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
    private static function rows(EmailFigures $figures, string $locale, string $title, string $ht, string $ttc, string $dueOn): array
    {
        $pairs = match ($figures->kind) {
            EmailTemplateKind::NewInvoice => [['subject', $title], ['due', $dueOn], ['transfer_reference', $figures->number]],
            EmailTemplateKind::NewQuote => [['subject', $title], ['amount_ht', $ht], ['amount_ttc', $ttc]],
            EmailTemplateKind::CreditNote => [
                ['original_invoice', $figures->cancelledInvoice ?? ''],
                ['reason', $figures->reason ?? ''],
                ['treatment', $figures->treatmentShort ?? ''],
            ],
            EmailTemplateKind::PaymentReminder => [['subject', $title], ['due_passed', $dueOn], ['transfer_reference', $figures->number]],
        };

        return array_map(static fn (array $pair): array => [
            'label' => (string) __("client_mail.card.{$pair[0]}", [], $locale),
            'value' => $pair[1],
        ], $pairs);
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
}
