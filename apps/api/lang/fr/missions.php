<?php

declare(strict_types=1);

return [
    'end_client_required_for_intermediary' => 'Un client final est requis lorsque le client facturé est un intermédiaire.',
    'end_client_only_for_intermediary' => 'Un client final ne peut être renseigné que lorsque le client facturé est un intermédiaire.',
    'rate_forbidden_for_internal' => 'Les missions d\'un client interne ne sont pas facturables.',
    'rounding_forbidden_for_fixed' => 'L\'arrondi ne s\'applique pas aux missions au forfait.',
    'cra_forbidden_for_hourly' => 'Un CRA compte des journées : il ne s\'applique pas à une mission facturée à l\'heure.',
    'cannot_delete_with_time_entries' => 'Impossible de supprimer une mission qui a encore des temps saisis. Supprimez-les d\'abord.',
    'cannot_delete_with_running_timer' => 'Impossible de supprimer une mission dont le suivi est en cours. Arrêtez-le d\'abord.',
    'cannot_delete_with_cras' => 'Impossible de supprimer une mission qui a des comptes rendus d\'activité. Supprimez-les d\'abord.',
    'cannot_leave_daily_billing_with_cras' => 'Cette mission a des comptes rendus d\'activité : elle ne peut plus passer à une facturation à l\'heure.',
    'billing_mode_immutable_with_entries' => 'Cette mission a des temps saisis : son mode de facturation ne peut plus changer. Un nouveau contrat est une nouvelle mission.',
];
