<?php

declare(strict_types=1);

/*
 * What an invoice prints. Chosen per document (its language), not from the
 * interface locale: a French account may send an English invoice.
 */
return [
    'label_separator' => ' :',
    'invoice' => 'Facture',
    'quote' => 'Devis',
    'number' => 'n° :number',
    'draft' => 'Brouillon',
    'issued_on' => 'Émise le',
    'due_on' => 'Échéance',
    'valid_until' => 'Valable jusqu\'au',
    'service' => 'Prestation',
    'period' => 'du :start au :end',
    'category' => 'Catégorie',
    'categories' => [
        'services' => 'Prestation de services',
        'goods' => 'Livraison de biens',
        'mixed' => 'Biens et services',
    ],
    'siret' => 'SIRET : :siret',
    'siren' => 'SIREN : :siren',
    'vat_number' => 'TVA intracom. : :number',
    'trade_registry' => ':registry',
    'head' => [
        'description' => 'Désignation',
        'quantity' => 'Qté',
        'unit_price' => 'PU HT',
        'vat' => 'TVA',
        'total' => 'Total HT',
    ],
    'units' => [
        'day' => 'j',
        'hour' => 'h',
        'flat' => 'forfait',
        'unit' => 'u',
    ],
    'no_lines' => 'Les lignes ajoutées apparaissent ici.',
    'vat_table' => [
        'base' => 'Base HT',
        'rate' => 'Taux',
        'amount' => 'Montant TVA',
    ],
    'totals' => [
        'ht' => 'Total HT',
        'vat' => 'TVA',
        'ttc' => 'Total TTC',
        'deposit' => 'Acompte à l\'acceptation (:rate %)',
    ],
    'payment' => [
        'title' => 'Informations de paiement',
        'reference' => 'Référence du virement',
        'reference_later' => 'attribuée à la validation',
    ],
    'legal' => [
        'on_receipt' => 'Paiement à réception.',
        'end_of_month' => 'Paiement en fin de mois, au plus tard le :due.',
        'term' => 'Paiement à :days jours, au plus tard le :due.',
        'term_end_of_month' => 'Paiement à :days jours fin de mois, au plus tard le :due.',
        'penalties' => 'En cas de retard, pénalités au taux annuel de :rate %, exigibles dès le lendemain de l\'échéance, et indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce). Pas d\'escompte pour paiement anticipé.',
        'penalties_statutory' => 'En cas de retard, pénalités au taux de la BCE majoré de 10 points, exigibles dès le lendemain de l\'échéance, et indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce). Pas d\'escompte pour paiement anticipé.',
        'franchise' => 'TVA non applicable, art. 293 B du CGI.',
        'debits' => 'Option pour le paiement de la taxe d\'après les débits.',
        'validity' => 'Devis valable jusqu\'au :date.',
        'deposit' => 'Un acompte de :rate % du total TTC est dû à l\'acceptation.',
        'quote_on_receipt' => 'Factures payables à réception.',
        'quote_term' => 'Factures payables à :days jours.',
        'quote_term_end_of_month' => 'Factures payables à :days jours fin de mois.',
        'from_quote' => 'Établie au titre du devis n° :number.',
        'deposit_invoice' => 'Facture d\'acompte de :rate % sur le devis n° :number.',
        'deducted_deposit' => 'n° :number du :date (:amount TTC)',
        'deposits_deducted' => 'Acompte déjà facturé et déduit : :list.',
    ],
    'quote_invoice' => [
        'deposit_line' => 'Acompte de :rate % sur le devis n° :number',
        'deposit_line_detail' => 'Part soumise à la TVA à :vat',
        'deducted_line' => 'Acompte facturé · :number du :date',
        'deposit_title' => 'Acompte · :title',
        'balance_title' => 'Solde · :title',
    ],
    'credit_note' => [
        'title' => 'Avoir',
        'issued_on' => 'Émis le',
        'invoice' => 'Facture d\'origine',
        'invoice_value' => 'n° :number du :date',
        'reason' => 'Motif',
        'reasons' => [
            'BillingError' => 'Erreur de facturation',
            'ServiceCancelled' => 'Prestation annulée',
            'CommercialGesture' => 'Geste commercial',
            'Other' => 'Autre',
        ],
        'relates' => 'Avoir se rapportant à la facture n° :number du :date.',
        'treatments' => [
            'CancelsInvoice' => 'Il annule cette facture en totalité : aucun paiement n\'est dû à son titre.',
            'ReducesBalance' => 'Son montant vient en déduction du solde restant dû sur cette facture.',
            'Refund' => 'Son montant est remboursé par virement.',
            'DeductFromNextInvoice' => 'Son montant sera déduit d\'une prochaine facture.',
        ],
        'balance_line' => 'Annulation du solde de la facture n° :number',
    ],
    'signature' => [
        'title' => 'Bon pour accord',
        'caption' => 'Date, signature et cachet, précédés de la mention « Bon pour accord ».',
    ],
];
