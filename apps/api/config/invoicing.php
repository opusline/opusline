<?php

declare(strict_types=1);

/** @var array{semester: string, checked_on: string, next_revision_on: string, legal_interest_rate_bp: int, ecb_rate_bp: int} $semesterFigures */
$semesterFigures = json_decode((string) file_get_contents(__DIR__.'/legal-reference.json'), true, flags: JSON_THROW_ON_ERROR);

return [

    /*
    |--------------------------------------------------------------------------
    | Legal reference for late payment
    |--------------------------------------------------------------------------
    |
    | Published by the State every semester: the taux de l'intérêt légal for a
    | professional creditor sets the floor of the late-payment penalty rate
    | (three times it), and the ECB refinancing rate on 1 January or 1 July,
    | plus ten points, is the rate owed when an invoice states none.
    |
    | The semester's figures live in legal-reference.json, which the Legal
    | reference workflow (scripts/legal-reference.mjs) rewrites at the start
    | of each semester: it takes the ECB rate from the ECB Data API and opens a
    | draft PR in which the legal interest rate, which has no open source,
    | is filled in from the arrêté before merging.
    |
    | Basis points: 275 is 2,75 %.
    |
    */

    'legal_reference' => [
        ...$semesterFigures,
        'recovery_fee_cents' => 4000,
        'sources' => [
            'legal_interest_rate' => 'https://www.service-public.gouv.fr/particuliers/vosdroits/F20688',
            'late_penalties' => 'https://help.shine.fr/fr/articles/4062963-comment-calculer-les-penalites-de-retard-de-paiement',
            'mandatory_mentions' => 'https://help.shine.fr/fr/articles/6715420-quelles-mentions-doivent-figurer-sur-mes-devis-factures',
        ],
    ],

];
