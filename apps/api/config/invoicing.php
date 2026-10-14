<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Legal reference for late payment
    |--------------------------------------------------------------------------
    |
    | Published by the State every semester: the taux de l'intérêt légal for a
    | professional creditor sets the floor of the late-payment penalty rate
    | (three times it), and the ECB refinancing rate on 1 January or 1 July,
    | plus ten points, is the rate owed when an invoice states none. Update
    | this block when the next semester's figures are published, and move
    | `checked_on` with it.
    |
    | Basis points: 275 is 2,75 %.
    |
    */

    'legal_reference' => [
        'semester' => '2026-H2',
        'checked_on' => '2026-10-14',
        'next_revision_on' => '2027-01-01',
        'legal_interest_rate_bp' => 275,
        'ecb_rate_bp' => 240,
        'recovery_fee_cents' => 4000,
        'sources' => [
            'legal_interest_rate' => 'https://www.service-public.gouv.fr/particuliers/vosdroits/F20688',
            'late_penalties' => 'https://help.shine.fr/fr/articles/4062963-comment-calculer-les-penalites-de-retard-de-paiement',
            'mandatory_mentions' => 'https://help.shine.fr/fr/articles/6715420-quelles-mentions-doivent-figurer-sur-mes-devis-factures',
        ],
    ],

];
