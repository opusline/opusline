<?php

declare(strict_types=1);

return [
    'rates_manual' => 'The official rate source is disabled. Re-enable it to read the URSSAF scale.',
    'rates_unavailable' => 'The URSSAF scale could not be read. Your current rates are unchanged.',
    'rates_foreign_country' => 'The URSSAF scale only applies to businesses established in France.',
    'currency_mismatch' => 'The currency does not match the account\'s.',
    'currency_locked' => 'The currency can no longer change: an amount has already been recorded in it.',
    'enable_banking_credentials_rejected' => 'Enable Banking refused this key. Check that it belongs to this application ID.',
    'enable_banking_redirect_missing' => 'Add :url to this application\'s redirect URLs in the Enable Banking control panel.',
    'enable_banking_inactive' => 'This application is not active yet: link your bank account to it in the Enable Banking control panel.',
    'anthropic_key_rejected' => 'Anthropic refused this key. Check that it is a live API key from console.anthropic.com.',
    'anthropic_model_unavailable' => 'This key cannot use :model. Check the model is enabled for its workspace.',
    'anthropic_unreachable' => 'Anthropic could not be reached to check the key. Try again in a few minutes.',
];
