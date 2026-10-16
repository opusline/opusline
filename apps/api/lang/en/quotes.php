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
];
