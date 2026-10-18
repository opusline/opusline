<?php

declare(strict_types=1);

return [
    'not_a_draft' => 'Seul un devis en brouillon peut être modifié.',
    'negative_total' => 'Les lignes ne peuvent pas donner un total négatif.',
    'number_taken' => 'Un autre devis porte déjà ce numéro.',
    'cannot_delete_issued' => 'Un devis envoyé ne peut pas être supprimé. Seul un brouillon le peut.',
    'cannot_decide' => 'Seul un devis envoyé et non expiré peut être accepté ou refusé. Rouvrez un devis expiré pour lui donner une nouvelle validité.',
    'cannot_reopen' => 'Seul un devis refusé ou expiré peut être rouvert.',
    'decided_on_before_issued' => 'La réponse ne peut pas précéder le jour où le devis a été envoyé.',
    'issue_needs_lines' => 'Ajoutez au moins une ligne avant de valider.',
    'issue_needs_positive_total' => 'Un devis ne peut pas totaliser zéro ou moins.',
    'issue_needs_vat_rework' => 'Votre régime de TVA a changé depuis l\'enregistrement de ce brouillon : ouvrez-le dans l\'éditeur et enregistrez-le à nouveau.',
    'issue_needs_seller_identity' => 'Complétez votre nom, votre adresse et votre SIRET dans les Réglages : ils sont obligatoires sur un devis.',
    'issue_needs_vat_number' => 'Ajoutez votre numéro de TVA dans les Réglages : une entreprise assujettie doit l\'imprimer sur ses devis.',
    'issue_needs_buyer_address' => 'Complétez l\'adresse de facturation du client sur sa fiche : elle est obligatoire sur un devis.',
    'cannot_delete_client_with_quotes' => 'Un client qui a encore des devis ne peut pas être supprimé. Supprimez-les d\'abord.',
    'cannot_delete_mission_with_quotes' => 'Une mission qui a encore des devis ne peut pas être supprimée. Supprimez-les d\'abord.',
    'cannot_invoice_unless_accepted' => 'Seul un devis accepté peut être facturé.',
    'deposit_already_invoiced' => 'L\'acompte de ce devis est déjà facturé.',
    'balance_needs_deposit' => 'Le solde suit une facture d\'acompte émise ; facturez plutôt la totalité du devis.',
    'already_invoiced' => 'Ce devis est déjà en cours de facturation : terminez par son solde.',
    'external_never_draft' => 'Un devis enregistré depuis un autre outil a été envoyé, accepté ou refusé : il ne peut pas être un brouillon.',
    'document_is_opuslines' => 'Opusline a classé le PDF qu\'il a généré pour ce devis ; aucun autre ne peut le remplacer.',
];
