<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** The e-mails Opusline writes to a client, each from a template the account may reword. */
enum EmailTemplateKind: int
{
    case NewInvoice = 0;
    case NewQuote = 1;
    case CreditNote = 2;
    case PaymentReminder = 3;

    /** The key of its default copy and labels in lang/client_mail.php. */
    public function langKey(): string
    {
        return match ($this) {
            self::NewInvoice => 'new_invoice',
            self::NewQuote => 'new_quote',
            self::CreditNote => 'credit_note',
            self::PaymentReminder => 'payment_reminder',
        };
    }

    /**
     * The placeholders a template of this kind may use, written `{name}` in
     * the stored text. French names, as the users who edit them are: the
     * document vocabulary (numéro, échéance, validité) is theirs. `{contact}`
     * is the client's contact, the person greeted; `{client}` the company.
     *
     * @return list<string>
     */
    public function variables(): array
    {
        return match ($this) {
            self::NewInvoice => ['numero', 'titre', 'montant', 'echeance', 'contact', 'client'],
            self::NewQuote => ['numero', 'titre', 'montant', 'validite', 'contact', 'client'],
            self::CreditNote => ['numero', 'facture', 'montant', 'traitement', 'contact', 'client'],
            self::PaymentReminder => ['numero', 'titre', 'montant', 'echeance', 'retard', 'penalites', 'contact', 'client'],
        };
    }

    /** Whether the e-mail asks for money, which is when it shows how to pay. */
    public function asksForPayment(): bool
    {
        return $this === self::NewInvoice || $this === self::PaymentReminder;
    }
}
