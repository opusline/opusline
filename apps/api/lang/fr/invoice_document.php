<?php

declare(strict_types=1);

/*
 * What an invoice prints. Chosen per document (its language), not from the
 * interface locale: a French account may send an English invoice.
 */
return [
    'label_separator' => ' :',
    'invoice' => 'Facture',
    'number' => 'n° :number',
    'draft' => 'Brouillon',
    'issued_on' => 'Émise le',
    'due_on' => 'Échéance',
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
    ],
];
