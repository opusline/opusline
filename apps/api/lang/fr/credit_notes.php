<?php

declare(strict_types=1);

return [
    'invoice_not_creditable' => 'Seule une facture émise dans Opusline, non annulée, peut recevoir un avoir.',
    'needs_lines' => 'Ajoutez au moins une ligne à l\'avoir.',
    'needs_positive_total' => 'Un avoir doit avoir un montant positif.',
    'exceeds_invoice' => 'L\'avoir dépasse ce qui reste sur la facture.',
    'full_after_credit' => 'Cette facture a déjà reçu un avoir : faites un avoir partiel ou un avoir du solde.',
    'nothing_left_to_pay' => 'Il ne reste rien à payer sur cette facture.',
    'balance_mixed_rates' => 'La facture mêle plusieurs taux de TVA : faites un avoir partiel ligne par ligne.',
    'line_not_on_invoice' => 'Cette ligne n\'appartient pas à la facture.',
    'settlement_required' => 'Le client a déjà payé : dites si le montant lui est remboursé ou déduit d\'une prochaine facture.',
    'number_taken' => 'Un autre avoir porte déjà ce numéro.',
];
