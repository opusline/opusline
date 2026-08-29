<?php

declare(strict_types=1);

return [
    'mission_does_not_require_one' => 'Cette mission ne demande pas de compte rendu d\'activité.',
    'mission_is_not_billed_by_the_day' => 'Un CRA compte des journées : il ne s\'applique pas à une mission facturée à l\'heure.',
    'month_is_in_the_future' => 'Impossible de produire le CRA d\'un mois qui n\'a pas commencé.',
    'already_exists' => 'Un CRA existe déjà pour cette mission et ce mois.',
    'already_issued' => 'Ce CRA est déjà transmis au client : ses journées ne peuvent plus changer.',
    'changed_while_sending' => 'La grille a changé pendant la préparation du document : rien n\'a été envoyé. Vérifiez les journées, puis renvoyez.',
    'day_outside_month' => 'Cette journée ne fait pas partie du mois du CRA.',
    'day_listed_twice' => 'Cette journée figure deux fois dans la grille.',
    'nothing_to_send' => 'Ce CRA ne comporte aucune journée : renseignez la grille avant de l\'envoyer.',
    'only_a_sent_cra_reopens' => 'Seul un CRA envoyé peut être rouvert.',
    'signed_return_filed' => 'Le retour signé est déjà archivé : ce CRA ne peut plus être rouvert.',
    'only_a_sent_cra_is_returned' => 'Le retour signé ne s\'enregistre que sur un CRA envoyé.',
];
