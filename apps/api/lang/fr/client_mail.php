<?php

declare(strict_types=1);

return [
    'templates' => [
        'new_invoice' => [
            'subject' => 'Facture {numero}',
            'body' => "Bonjour {client},\n\nVeuillez trouver ci-joint la facture {numero} d'un montant de {montant}, à régler avant le {echeance}.\n\nMerci de votre confiance,\n{contact}",
        ],
        'new_quote' => [
            'subject' => 'Devis {numero}',
            'body' => "Bonjour {client},\n\nVeuillez trouver ci-joint le devis {numero} d'un montant de {montant}. Il est valable jusqu'au {validite} : retournez-le signé pour le confirmer.\n\nJe reste à votre disposition pour toute question,\n{contact}",
        ],
        'credit_note' => [
            'subject' => 'Avoir {numero}',
            'body' => "Bonjour {client},\n\nVeuillez trouver ci-joint l'avoir {numero} d'un montant de {montant}, émis sur la facture {facture}. {traitement}\n\nBien cordialement,\n{contact}",
        ],
        'payment_reminder' => [
            'subject' => 'Relance · facture {numero}',
            'body' => "Bonjour {client},\n\nSauf erreur de notre part, la facture {numero} d'un montant de {montant}, échue le {echeance}, reste impayée ({retard}). Vous la trouverez de nouveau ci-jointe ; n'hésitez pas à me dire si le règlement est en cours.\n\nBien cordialement,\n{contact}",
        ],
    ],
    'treatment' => [
        'cancelled' => 'Il annule cette facture en totalité.',
        'deducted_from_balance' => 'Son montant est déduit du solde restant dû.',
        'refunded' => 'Son montant vous sera remboursé.',
        'deducted_from_next' => 'Son montant sera déduit de la prochaine facture.',
    ],
    'late' => '{1} un jour de retard|[2,*] :count jours de retard',
    'card' => [
        'new_invoice' => 'Facture :number',
        'new_quote' => 'Devis :number',
        'credit_note' => 'Avoir :number',
        'payment_reminder' => 'Facture :number · relance',
        'amount' => 'Montant TTC',
        'due' => 'À régler avant le',
        'validity' => 'Valable jusqu\'au',
        'attached' => 'Le PDF est joint à cet e-mail.',
    ],
    'payment' => [
        'title' => 'Règlement par virement',
        'iban' => 'IBAN',
        'bic' => 'BIC',
        'reference' => 'Référence : :number',
    ],
    'footer' => 'Envoyé avec Opusline pour le compte de :name.',
    'test' => [
        'banner' => 'E-mail de test : voici ce que donne :kind avec des chiffres d\'exemple. Rien n\'a été envoyé à un client.',
    ],
    'sample' => [
        'client' => 'Nordlys',
        'contact' => 'Camille Aubrac',
        'title' => 'Refonte du site',
        'cancelled_invoice' => 'F-2026-011',
    ],
    'unknown_variable' => 'Variable inconnue :name. Celles que cet e-mail connaît : :known.',
    'relay_failed' => 'Le relais de messagerie a refusé l\'e-mail : :reason',
];
