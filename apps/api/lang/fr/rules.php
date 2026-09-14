<?php

declare(strict_types=1);

return [
    'siret' => 'Le SIRET doit comporter 14 chiffres et être valide.',
    'vat_number' => 'Le numéro de TVA intracommunautaire est invalide.',
    'invoice_number_format' => 'Le format doit contenir un seul compteur NNN et n\'accepter que les jetons AAAA, MM et NNN.',
    'expense_vat_rate' => 'Le taux de TVA ne correspond pas au régime : un achat hors TVA n\'en porte aucun, une autoliquidation en exige un.',
    'subscription_debit_month' => 'Un abonnement annuel a besoin de son mois de prélèvement.',
    'subscription_amount_before_start' => 'Un changement de prix ne peut pas précéder le premier prélèvement de l’abonnement.',
];
