<?php

declare(strict_types=1);

return [
    'templates' => [
        'new_invoice' => [
            'subject' => 'Facture {numero} ({titre})',
            'body' => "Bonjour {contact},\n\nVoici la facture {numero} pour {titre}, d'un montant de {montant} TTC, à régler avant le {echeance}.\n\nLe virement peut se faire sur le compte indiqué plus bas. Merci de reprendre {numero} dans le libellé, cela m'aide à le rapprocher.\n\nBonne journée,",
        ],
        'new_quote' => [
            'subject' => 'Devis {numero} ({titre})',
            'body' => "Bonjour {contact},\n\nComme convenu, voici le devis {numero} pour {titre} : {montant} HT, valable jusqu'au {validite}.\n\nPour l'accepter, il suffit de me le renvoyer signé avec la mention « bon pour accord », ou de répondre à cet e-mail. Si un point doit changer, dites-le-moi et je l'ajuste.\n\nBonne journée,",
        ],
        'credit_note' => [
            'subject' => 'Avoir {numero} (facture {facture})',
            'body' => "Bonjour {contact},\n\nVoici l'avoir {numero}, d'un montant de {montant} TTC, qui se rapporte à la facture {facture}.\n\n{traitement}\n\nBonne journée,",
        ],
        'payment_reminder' => [
            'subject' => 'Relance : facture {numero} en attente de paiement',
            'body' => "Bonjour {contact},\n\nJe n'ai pas encore reçu le règlement de la facture {numero} ({montant} TTC), arrivée à échéance le {echeance}.\n\nPouvez-vous regarder de votre côté ? Si le virement est déjà parti, ne tenez pas compte de ce message.\n\nPour mémoire, les conditions de la facture prévoient en cas de retard des pénalités au taux annuel de {penalites} % et une indemnité forfaitaire de 40 € pour frais de recouvrement.\n\nMerci,",
        ],
    ],
    'treatment' => [
        'cancelled' => 'Il annule cette facture en totalité.',
        'deducted_from_balance' => 'Son montant est déduit du solde restant dû.',
        'refunded' => 'Son montant vous sera remboursé.',
        'deducted_from_next' => 'Son montant sera déduit de la prochaine facture.',
    ],
    'card' => [
        'new_invoice' => 'Facture :number',
        'new_quote' => 'Devis :number',
        'credit_note' => 'Avoir :number',
        'payment_reminder' => 'Reste à payer · :number',
        'late' => 'En retard de :days j',
        'valid_until' => 'Valable jusqu\'au :date',
        'subject' => 'Objet',
        'due' => 'À régler avant le',
        'due_passed' => 'Échue le',
        'transfer_reference' => 'Référence de virement',
        'amount_ht' => 'Montant HT',
        'amount_ttc' => 'Montant TTC',
        'original_invoice' => 'Facture d\'origine',
        'reason' => 'Motif',
        'treatment' => 'Traitement',
        'attachment' => 'Pièce jointe · PDF',
    ],
    'payment' => [
        'title' => 'Paiement par virement',
        'iban' => 'IBAN',
        'bic' => 'BIC',
        'reference' => 'Référence',
    ],
    'signature' => [
        'siret' => ':name · SIRET :siret',
    ],
    'footer' => 'Envoyé avec Opusline pour le compte de :name. Répondre à cet e-mail écrit directement à :email.',
    'test' => [
        'banner' => 'E-mail de test : voici ce que donne « :kind » avec des chiffres d\'exemple. Rien n\'a été envoyé à un client.',
    ],
    'sample' => [
        'client' => 'Nordlys',
        'contact' => 'Sophie',
        'title' => 'Refonte du site',
        'cancelled_invoice' => 'F-2026-011',
        'reason' => 'Prestation annulée',
        'treatment_short' => 'Annulation',
    ],
    'unknown_variable' => 'Variable inconnue :name. Celles que cet e-mail connaît : :known.',
    'relay_failed' => 'Le relais de messagerie a refusé l\'e-mail : :reason',
    'needs_number' => 'Renseignez la référence de la facture avant de l\'envoyer.',
    'validate_before_sending' => 'Validez d\'abord le document : un brouillon n\'a rien à envoyer.',
    'no_document' => 'Aucun PDF à joindre : classez d\'abord le document.',
    'no_reminder_recipients' => 'Cette facture n\'a jamais été envoyée depuis Opusline, il n\'y a donc personne à relancer : envoyez-la d\'abord.',
];
