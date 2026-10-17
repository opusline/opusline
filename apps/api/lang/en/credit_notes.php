<?php

declare(strict_types=1);

return [
    'invoice_not_creditable' => 'Only an invoice issued in Opusline, not cancelled, can take a credit note.',
    'needs_lines' => 'Add at least one line to the credit note.',
    'needs_positive_total' => 'A credit note must have a positive amount.',
    'exceeds_invoice' => 'The credit note is larger than what is left on the invoice.',
    'full_after_credit' => 'This invoice already has a credit note: make a partial or a balance credit note.',
    'nothing_left_to_pay' => 'Nothing is left to pay on this invoice.',
    'balance_mixed_rates' => 'The invoice mixes several VAT rates: make a partial credit note, line by line.',
    'line_not_on_invoice' => 'This line does not belong to the invoice.',
    'settlement_required' => 'The client already paid: say whether the amount is refunded or deducted from a later invoice.',
    'number_taken' => 'Another credit note already uses this number.',
    'not_to_refund' => 'This credit note owes no refund, or it was already refunded.',
    'refund_before_issue' => 'The refund cannot precede the credit note.',
    'movement_not_a_free_debit' => 'Choose a debit of the pro account that is not linked to anything yet.',
    'movement_amount_mismatch' => 'The debit is not the amount owed back to the client.',
    'not_deductible' => 'A credit note to deduct must be the same client\'s, waiting to be deducted, and not claimed by another invoice.',
    'deduction_exceeds_invoice' => 'The credit notes to deduct are larger than this invoice.',
    'deduction_payment_fixed' => 'A deduction belongs to the invoice that carried it: it cannot be taken back alone.',
];
