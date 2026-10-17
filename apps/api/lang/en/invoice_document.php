<?php

declare(strict_types=1);

/*
 * What an invoice prints. Chosen per document (its language), not from the
 * interface locale: a French account may send an English invoice.
 */
return [
    'label_separator' => ':',
    'invoice' => 'Invoice',
    'quote' => 'Quote',
    'number' => 'no. :number',
    'draft' => 'Draft',
    'issued_on' => 'Issued on',
    'due_on' => 'Due date',
    'valid_until' => 'Valid until',
    'service' => 'Service period',
    'period' => 'from :start to :end',
    'category' => 'Category',
    'categories' => [
        'services' => 'Services',
        'goods' => 'Goods',
        'mixed' => 'Goods and services',
    ],
    'siret' => 'Registration no.: :siret',
    'siren' => 'SIREN: :siren',
    'vat_number' => 'VAT no.: :number',
    'trade_registry' => ':registry',
    'head' => [
        'description' => 'Description',
        'quantity' => 'Qty',
        'unit_price' => 'Unit price',
        'vat' => 'VAT',
        'total' => 'Total excl. VAT',
    ],
    'units' => [
        'day' => 'd',
        'hour' => 'h',
        'flat' => 'fixed',
        'unit' => 'u',
    ],
    'no_lines' => 'Added lines appear here.',
    'vat_table' => [
        'base' => 'Base',
        'rate' => 'Rate',
        'amount' => 'VAT amount',
    ],
    'totals' => [
        'ht' => 'Total excl. VAT',
        'vat' => 'VAT',
        'ttc' => 'Total incl. VAT',
        'deposit' => 'Deposit on acceptance (:rate %)',
    ],
    'payment' => [
        'title' => 'Payment information',
        'reference' => 'Transfer reference',
        'reference_later' => 'assigned on validation',
    ],
    'legal' => [
        'on_receipt' => 'Payment due on receipt.',
        'end_of_month' => 'Payment due at end of month, no later than :due.',
        'term' => 'Payment due within :days days, no later than :due.',
        'term_end_of_month' => 'Payment due within :days days end of month, no later than :due.',
        'penalties' => 'Late payments bear interest at an annual rate of :rate % from the day after the due date, plus a fixed recovery fee of €40 (French Commercial Code, art. L441-10). No discount for early payment.',
        'penalties_statutory' => 'Late payments bear interest at the ECB rate plus 10 points from the day after the due date, plus a fixed recovery fee of €40 (French Commercial Code, art. L441-10). No discount for early payment.',
        'franchise' => 'VAT not applicable, art. 293 B of the French Tax Code.',
        'debits' => 'VAT paid on debits (option exercised).',
        'validity' => 'This quote is valid until :date.',
        'deposit' => 'A deposit of :rate % of the total incl. VAT is due on acceptance.',
        'quote_on_receipt' => 'Invoices are payable on receipt.',
        'quote_term' => 'Invoices are payable within :days days.',
        'quote_term_end_of_month' => 'Invoices are payable within :days days end of month.',
        'from_quote' => 'Issued under quote no. :number.',
        'deposit_invoice' => 'Deposit invoice of :rate % on quote no. :number.',
        'deducted_deposit' => 'no. :number of :date (:amount incl. VAT)',
        'deposits_deducted' => 'Deposit already invoiced and deducted: :list.',
    ],
    'quote_invoice' => [
        'deposit_line' => 'Deposit of :rate % on quote no. :number',
        'deposit_line_detail' => 'Share subject to :vat VAT',
        'deducted_line' => 'Deposit invoiced · :number on :date',
        'deposit_title' => 'Deposit · :title',
        'balance_title' => 'Balance · :title',
    ],
    'credit_note' => [
        'title' => 'Credit note',
        'issued_on' => 'Issued on',
        'invoice' => 'Original invoice',
        'invoice_value' => 'no. :number of :date',
        'reason' => 'Reason',
        'reasons' => [
            'BillingError' => 'Billing error',
            'ServiceCancelled' => 'Service cancelled',
            'CommercialGesture' => 'Commercial gesture',
            'Other' => 'Other',
        ],
        'relates' => 'Credit note relating to invoice no. :number of :date.',
        'treatments' => [
            'CancelsInvoice' => 'It cancels this invoice in full: no payment is due under it.',
            'ReducesBalance' => 'Its amount is deducted from the balance still due on this invoice.',
            'Refund' => 'Its amount is refunded by bank transfer.',
            'DeductFromNextInvoice' => 'Its amount will be deducted from a later invoice.',
        ],
        'balance_line' => 'Cancellation of the balance of invoice no. :number',
    ],
    'signature' => [
        'title' => 'Accepted and agreed',
        'caption' => 'Date, signature and company stamp, preceded by « Bon pour accord ».',
    ],
];
