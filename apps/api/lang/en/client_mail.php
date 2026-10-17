<?php

declare(strict_types=1);

return [
    'templates' => [
        'new_invoice' => [
            'subject' => 'Invoice {numero}',
            'body' => "Hello {client},\n\nPlease find attached invoice {numero} for {montant}, due by {echeance}.\n\nThank you for your trust,\n{contact}",
        ],
        'new_quote' => [
            'subject' => 'Quote {numero}',
            'body' => "Hello {client},\n\nPlease find attached quote {numero} for {montant}. It is valid until {validite}: return it signed to confirm.\n\nI remain available for any question,\n{contact}",
        ],
        'credit_note' => [
            'subject' => 'Credit note {numero}',
            'body' => "Hello {client},\n\nPlease find attached credit note {numero} for {montant}, issued against invoice {facture}. {traitement}\n\nBest regards,\n{contact}",
        ],
        'payment_reminder' => [
            'subject' => 'Reminder · invoice {numero}',
            'body' => "Hello {client},\n\nUnless an error on our side, invoice {numero} for {montant}, due on {echeance}, is still unpaid ({retard}). The invoice is attached again; please let me know if the payment is on its way.\n\nBest regards,\n{contact}",
        ],
    ],
    'treatment' => [
        'cancelled' => 'It cancels that invoice in full.',
        'deducted_from_balance' => 'Its amount is deducted from the balance due.',
        'refunded' => 'Its amount will be refunded to you.',
        'deducted_from_next' => 'Its amount will be deducted from the next invoice.',
    ],
    'late' => '{1} late by one day|[2,*] late by :count days',
    'card' => [
        'new_invoice' => 'Invoice :number',
        'new_quote' => 'Quote :number',
        'credit_note' => 'Credit note :number',
        'payment_reminder' => 'Invoice :number · reminder',
        'amount' => 'Amount incl. VAT',
        'due' => 'Due by',
        'validity' => 'Valid until',
        'attached' => 'The PDF is attached to this e-mail.',
    ],
    'payment' => [
        'title' => 'Payment by bank transfer',
        'iban' => 'IBAN',
        'bic' => 'BIC',
        'reference' => 'Reference: :number',
    ],
    'footer' => 'Sent with Opusline on behalf of :name.',
    'test' => [
        'banner' => 'Test e-mail: this is how :kind reads with sample figures. Nothing was sent to a client.',
    ],
    'sample' => [
        'client' => 'Nordlys',
        'contact' => 'Camille Aubrac',
        'title' => 'Website redesign',
        'cancelled_invoice' => 'F-2026-011',
    ],
    'unknown_variable' => 'Unknown variable :name. The ones this e-mail knows: :known.',
    'relay_failed' => 'The mail relay refused the e-mail: :reason',
];
