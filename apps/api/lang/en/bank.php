<?php

declare(strict_types=1);

return [
    'unreadable_file' => 'This file could not be read as a bank statement.',
    'no_movements' => 'No movements were found in this statement.',
    'too_many_movements' => 'This statement holds more than 20,000 movements. Export a shorter period and import it in parts.',
    'statement_currency_mismatch' => 'This statement is not in the account currency.',
    'match_already_settled' => 'This suggestion has already been validated or dismissed.',
    'movement_in_future' => 'This movement is dated in the future and cannot settle an invoice yet.',
    'sync_unavailable' => 'The bank could not be reached through Enable Banking. Try again later.',
    'sync_rate_limited' => 'The bank limits how often it can be read. Try again in a few hours.',
    'sync_consent_expired' => 'The access to the bank has expired. Reconnect the bank to resume syncing.',
    'sync_credentials_rejected' => 'Enable Banking refused the application key. Check it in Settings › Integrations.',
    'sync_currency_mismatch' => 'The bank account is not in the account currency.',
    'sync_not_configured' => 'Add your Enable Banking application in Settings › Integrations first.',
    'sync_not_connected' => 'No bank account is connected.',
    'sync_authorization_expired' => 'This bank authorization has expired or was already used. Start the connection again.',
    'sync_unknown_bank' => 'This bank is not available through Enable Banking.',
    'sync_psu_type_unsupported' => 'This bank does not offer this type of account.',
    'sync_unknown_account' => 'This account is not part of the bank authorization.',
];
