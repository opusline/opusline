<?php

declare(strict_types=1);

return [
    'siret' => 'The SIRET must be 14 digits and pass its checksum.',
    'vat_number' => 'The intra-community VAT number is invalid.',
    'invoice_number_format' => 'The format must contain exactly one NNN counter and only the AAAA, MM and NNN tokens.',
    'expense_vat_rate' => 'The VAT rate does not match the VAT treatment: an exempt purchase carries none, a reverse charge needs one.',
    'subscription_debit_month' => 'An annual subscription needs the month it is debited in.',
    'subscription_amount_before_start' => 'A price change cannot predate the subscription\'s first debit.',
];
