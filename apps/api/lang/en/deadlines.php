<?php

declare(strict_types=1);

return [
    'unknown_occurrence' => 'This deadline is not one your fiscal profile produces.',

    'calendar_name' => 'Opusline — échéances fiscales',
    'calendar_description' => 'URSSAF, TVA and CFE, kept up to date by Opusline.',

    'event_title' => ':obligation — :period',
    'event_invoice_title' => ':number · :client',
    'event_reminder_title' => 'Relancer :client (:number)',
    'event_estimate' => 'Estimate: :amount',
    'event_expected' => 'Expected: :amount',
    'event_completed' => 'Marked as done in Opusline.',

    'period_quarter' => 'Q:quarter :year',

    'kind' => [
        'UrssafDeclaration' => 'Déclaration URSSAF',
        'VatCa3' => 'TVA — CA3',
        'VatCa12' => 'TVA — CA12',
        'Cfe' => 'CFE',
        'CfeInstalment' => 'CFE — acompte',
    ],
];
