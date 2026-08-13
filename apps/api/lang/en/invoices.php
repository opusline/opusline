<?php

declare(strict_types=1);

return [
    'mission_client_mismatch' => 'That mission does not belong to the billed client.',
    'ttc_below_ht' => 'The gross amount cannot be lower than the net amount.',
    'due_before_issued' => 'The due date cannot precede the issue date.',
    'period_end_before_start' => 'The period end cannot precede its start.',
    'number_taken' => 'Another invoice already uses that reference.',
    'number_required_once_issued' => 'Set the invoice reference before marking it as sent.',
    'paid_on_required' => 'A payment date is required for a paid invoice.',
    'cannot_move_with_linked_time_entries' => 'Change the linked time first: tracked time is attached to this invoice.',
    'paid_on_without_payment' => 'A payment date belongs only on a paid invoice.',
    'cannot_delete_issued' => 'An issued invoice cannot be deleted. Only a draft can.',
    'cannot_send_unless_draft' => 'Only a draft can be marked as sent.',
    'cannot_pay_unless_sent' => 'Only a sent invoice can be marked as paid.',
    'cannot_remind' => 'A reminder can only be logged on a sent, unpaid invoice.',
    'cannot_move_invoiced_time_entry' => 'This time is billed by an invoice. Change the invoice linkage first.',
    'cannot_delete_invoiced_time_entry' => 'This time is billed by an invoice. Detach it from the invoice before deleting it.',
    'cannot_delete_client_with_invoices' => 'A client that still has invoices cannot be deleted. Delete them first.',
    'cannot_delete_mission_with_invoices' => 'A mission that still has invoices cannot be deleted. Delete them first.',
];
