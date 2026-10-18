<?php

declare(strict_types=1);

return [
    'templates' => [
        'new_invoice' => [
            'subject' => 'Invoice {numero} ({titre})',
            'body' => "Hello {contact},\n\nHere is invoice {numero} for {titre}, {montant} incl. VAT, due by {echeance}.\n\nThe transfer can go to the account below. Please quote {numero} in the reference, it helps me match it.\n\nHave a good day,",
        ],
        'new_quote' => [
            'subject' => 'Quote {numero} ({titre})',
            'body' => "Hello {contact},\n\nAs agreed, here is quote {numero} for {titre}: {montant} excl. VAT, valid until {validite}.\n\nTo accept it, return it signed with the words \"approved\", or reply to this e-mail. If anything should change, tell me and I will adjust it.\n\nHave a good day,",
        ],
        'credit_note' => [
            'subject' => 'Credit note {numero} (invoice {facture})',
            'body' => "Hello {contact},\n\nHere is credit note {numero}, {montant} incl. VAT, which relates to invoice {facture}.\n\n{traitement}\n\nHave a good day,",
        ],
        'payment_reminder' => [
            'subject' => 'Reminder: invoice {numero} awaiting payment',
            'body' => "Hello {contact},\n\nI have not yet received the payment of invoice {numero}, which fell due on {echeance}: {reste} incl. VAT is still due.\n\nCould you check on your side? If the transfer has already left, please ignore this message.\n\nAs a reminder, the invoice terms provide for late-payment penalties at an annual rate of {penalites} % and a fixed €40 recovery fee.\n\nThank you,",
        ],
    ],
    'treatment' => [
        'cancelled' => 'It cancels that invoice in full.',
        'deducted_from_balance' => 'Its amount is deducted from the balance due.',
        'refunded' => 'Its amount will be refunded to you.',
        'deducted_from_next' => 'Its amount will be deducted from the next invoice.',
    ],
    'card' => [
        'new_invoice' => 'Invoice :number',
        'new_quote' => 'Quote :number',
        'credit_note' => 'Credit note :number',
        'payment_reminder' => 'Left to pay · :number',
        'late' => ':days days late',
        'valid_until' => 'Valid until :date',
        'subject' => 'Subject',
        'due' => 'Due by',
        'due_passed' => 'Fell due on',
        'transfer_reference' => 'Transfer reference',
        'amount_ht' => 'Amount excl. VAT',
        'amount_ttc' => 'Amount incl. VAT',
        'original_invoice' => 'Original invoice',
        'reason' => 'Reason',
        'treatment' => 'Treatment',
        'attachment' => 'Attachment · PDF',
    ],
    'payment' => [
        'title' => 'Payment by bank transfer',
        'iban' => 'IBAN',
        'bic' => 'BIC',
        'reference' => 'Reference',
    ],
    'signature' => [
        'siret' => ':name · SIRET :siret',
    ],
    'footer' => 'Sent with Opusline on behalf of :name. Replying to this e-mail writes directly to :email.',
    'test' => [
        'banner' => 'Test e-mail: this is how ":kind" reads with sample figures. Nothing was sent to a client.',
    ],
    'sample' => [
        'client' => 'Nordlys',
        'contact' => 'Sophie',
        'title' => 'Website redesign',
        'cancelled_invoice' => 'F-2026-011',
        'reason' => 'Cancelled service',
        'treatment_short' => 'Cancellation',
    ],
    'unknown_variable' => 'Unknown variable :name. The ones this e-mail knows: :known.',
    'relay_failed' => 'The mail relay refused the e-mail: :reason',
    'validate_before_sending' => 'Validate the document first: a draft has nothing to send.',
    'no_document' => 'No PDF to attach: file the document first.',
    'written_elsewhere' => 'This document was issued in another tool, which sent it: Opusline only e-mails what it wrote.',
    'no_reminder_recipients' => 'This invoice was never e-mailed from Opusline, so there is nobody to remind: send it first.',
];
