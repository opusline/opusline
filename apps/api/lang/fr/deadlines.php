<?php

declare(strict_types=1);

return [
    'unknown_occurrence' => 'Cette échéance ne fait pas partie de celles que produit votre profil fiscal.',

    'calendar_name' => 'Opusline — échéances fiscales',
    'calendar_description' => 'URSSAF, TVA et CFE, tenus à jour par Opusline.',

    'event_title' => ':obligation — :period',
    'event_invoice_title' => ':number · :client',
    'event_reminder_title' => 'Relancer :client (:number)',
    'event_estimate' => 'Estimation : :amount',
    'event_expected' => 'Montant attendu : :amount',
    'event_completed' => 'Marquée comme faite dans Opusline.',

    'period_quarter' => 'T:quarter :year',

    'kind' => [
        'UrssafDeclaration' => 'Déclaration URSSAF',
        'VatCa3' => 'TVA — CA3',
        'VatCa12' => 'TVA — CA12',
        'Cfe' => 'CFE',
        'CfeInstalment' => 'CFE — acompte',
    ],
];
