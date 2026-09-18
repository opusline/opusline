<?php

declare(strict_types=1);

return [
    'unreadable_file' => 'Ce fichier n\'a pas pu être lu comme un relevé bancaire.',
    'no_movements' => 'Aucun mouvement trouvé dans ce relevé.',
    'too_many_movements' => 'Ce relevé contient plus de 20 000 mouvements. Exportez une période plus courte et importez-la en plusieurs fois.',
    'statement_currency_mismatch' => 'Ce relevé n\'est pas dans la devise du compte.',
    'match_already_settled' => 'Cette suggestion a déjà été validée ou écartée.',
    'movement_in_future' => 'Ce mouvement est daté dans le futur et ne peut pas encore solder une facture.',
    'sync_unavailable' => 'La banque est injoignable via Enable Banking. Réessayez plus tard.',
    'sync_rate_limited' => 'La banque limite le nombre de lectures. Réessayez dans quelques heures.',
    'sync_consent_expired' => 'L\'accès à la banque a expiré. Reconnectez la banque pour reprendre la synchronisation.',
    'sync_credentials_rejected' => 'Enable Banking a refusé la clé de l\'application. Vérifiez-la dans Réglages › Intégrations.',
    'sync_currency_mismatch' => 'Le compte bancaire n\'est pas dans la devise du compte.',
    'sync_not_configured' => 'Ajoutez d\'abord votre application Enable Banking dans Réglages › Intégrations.',
    'sync_not_connected' => 'Aucun compte bancaire n\'est connecté.',
    'sync_authorization_expired' => 'Cette autorisation bancaire a expiré ou a déjà servi. Relancez la connexion.',
    'sync_unknown_bank' => 'Cette banque n\'est pas disponible via Enable Banking.',
    'sync_psu_type_unsupported' => 'Cette banque ne propose pas ce type de compte.',
    'sync_unknown_account' => 'Ce compte ne fait pas partie de l\'autorisation bancaire.',
];
