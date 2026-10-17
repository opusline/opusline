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
    'not_to_refund' => 'Cet avoir n\'appelle pas de remboursement, ou il a déjà été remboursé.',
    'refund_before_issue' => 'Le remboursement ne peut pas précéder l\'avoir.',
    'movement_not_a_free_debit' => 'Choisissez un débit du compte pro qui n\'est encore lié à rien.',
    'movement_amount_mismatch' => 'Le débit n\'est pas le montant dû au client.',
    'not_deductible' => 'Un avoir à déduire doit être du même client, en attente de déduction, et non retenu par une autre facture.',
    'deduction_exceeds_invoice' => 'Les avoirs à déduire dépassent cette facture.',
    'deduction_payment_fixed' => 'Une déduction appartient à la facture qui l\'a portée : elle ne se retire pas seule.',
];
