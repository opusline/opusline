<?php

declare(strict_types=1);

return [
    'mission_client_mismatch' => 'Cette mission n\'appartient pas au client facturé.',
    'ttc_below_ht' => 'Le montant TTC ne peut pas être inférieur au montant HT.',
    'due_before_issued' => 'L\'échéance ne peut pas précéder la date d\'émission.',
    'period_end_before_start' => 'La fin de période ne peut pas précéder son début.',
    'number_taken' => 'Une autre facture porte déjà cette référence.',
    'number_required_once_issued' => 'Renseignez la référence de la facture avant de la marquer envoyée.',
    'paid_on_required' => 'La date d\'encaissement est requise pour une facture payée.',
    'cannot_move_with_linked_time_entries' => 'Modifiez d\'abord le rattachement : des temps saisis sont rattachés à cette facture.',
    'paid_on_without_payment' => 'Une date d\'encaissement ne se renseigne que sur une facture payée.',
    'cannot_delete_issued' => 'Impossible de supprimer une facture déjà émise. Seul un brouillon peut être supprimé.',
    'cannot_send_unless_draft' => 'Seul un brouillon peut être marqué comme envoyé.',
    'cannot_pay_unless_sent' => 'Seule une facture envoyée peut être marquée comme payée.',
    'cannot_remind' => 'Une relance ne se note que sur une facture envoyée et non encore payée.',
    'cannot_move_invoiced_time_entry' => 'Ce temps est rattaché à une facture. Modifiez d\'abord le rattachement de la facture.',
    'cannot_delete_invoiced_time_entry' => 'Ce temps est rattaché à une facture. Détachez-le de la facture avant de le supprimer.',
    'cannot_delete_client_with_invoices' => 'Impossible de supprimer un client qui a encore des factures. Supprimez-les d\'abord.',
    'cannot_delete_mission_with_invoices' => 'Impossible de supprimer une mission qui a encore des factures. Supprimez-les d\'abord.',
];
