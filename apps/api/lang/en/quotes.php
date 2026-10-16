<?php

declare(strict_types=1);

return [
    'not_a_draft' => 'Only a draft quote can be edited.',
    'negative_total' => 'The lines cannot add up to a negative total.',
    'number_taken' => 'Another quote already uses that number.',
    'cannot_delete_issued' => 'A sent quote cannot be deleted. Only a draft can.',
    'cannot_decide_unless_sent' => 'Only a sent quote can be accepted or refused.',
    'expired' => 'This quote has expired: reopen it to give it a new validity.',
    'cannot_reopen' => 'Only a refused or expired quote can be reopened.',
    'decided_on_before_issued' => 'The answer cannot precede the day the quote was sent.',
    'issue_needs_lines' => 'Add at least one line before validating.',
    'issue_needs_positive_total' => 'A quote cannot total zero or less.',
    'issue_needs_vat_rework' => 'Your VAT regime changed since this draft was saved: open it in the editor and save it again.',
    'issue_needs_seller_identity' => 'Complete your name, address and SIRET in Settings: they are mandatory on a quote.',
    'issue_needs_buyer_address' => 'Complete the client\'s billing address on its record: it is mandatory on a quote.',
    'cannot_delete_client_with_quotes' => 'A client that still has quotes cannot be deleted. Delete them first.',
    'cannot_delete_mission_with_quotes' => 'A mission that still has quotes cannot be deleted. Delete them first.',
    'cannot_invoice_unless_accepted' => 'Only an accepted quote can be invoiced.',
    'deposit_already_invoiced' => 'The deposit of this quote is already invoiced.',
    'balance_needs_deposit' => 'The balance follows an issued deposit invoice; invoice the whole quote instead.',
    'already_invoiced' => 'This quote is already being invoiced: finish with its balance.',
    'external_never_draft' => 'A quote recorded from another tool was sent, accepted or refused: it cannot be a draft.',
    'document_is_opuslines' => 'Opusline filed the PDF it rendered for this quote; no other may stand in for it.',
];
