<?php

declare(strict_types=1);

return [
    'deadlines' => [
        'action' => 'Ouvrir mes échéances',
        'due_in_days' => 'Dans :days jours, le :date : :deadline',
        'due_today' => 'Aujourd\'hui : :deadline',
        'due_tomorrow' => 'Demain : :deadline',
        'footer' => 'Vous recevez cet e-mail parce que les rappels d\'échéances sont activés dans vos réglages de notifications.',
        'intro' => 'Voici ce qui arrive bientôt à échéance sur votre compte.',
        'invoice' => 'Facture :number (:client)',
        'subject' => '{1} Une échéance approche|[2,*] :count échéances approchent',
        'with_amount' => ':title. :amount',
    ],
    'password_reset' => [
        'action' => 'Choisir un nouveau mot de passe',
        'expires' => 'Ce lien fonctionne une seule fois, pendant les :count prochaines minutes.',
        'line' => 'Une réinitialisation du mot de passe a été demandée pour votre compte. Utilisez le bouton ci-dessous pour en choisir un nouveau.',
        'not_you' => 'Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet e-mail : votre mot de passe reste inchangé.',
        'subject' => 'Réinitialisez votre mot de passe',
    ],
    'security' => [
        'action' => 'Vérifier mes réglages',
        'device' => 'Navigateur : :device',
        'ip' => 'Adresse IP : :ip',
        'kind' => [
            'AlertsTurnedOff' => [
                'line' => 'Les alertes de sécurité ont été désactivées pour votre compte. Celle-ci est la dernière que vous recevrez tant qu\'elles ne sont pas réactivées.',
                'subject' => 'Les alertes de sécurité ont été désactivées',
            ],
            'BrowserTrusted' => [
                'line' => 'Un navigateur a été marqué comme navigateur de confiance sur votre compte. Il peut se connecter sans la vérification en deux étapes jusqu\'à l\'expiration de cette confiance.',
                'subject' => 'Un navigateur de confiance a été ajouté à votre compte',
            ],
            'EmailChanged' => [
                'line' => 'L\'adresse e-mail de connexion de votre compte a été remplacée par :email. Ce message est envoyé à l\'ancienne adresse, qui ne permet plus de se connecter.',
                'subject' => 'Votre adresse e-mail de connexion a été modifiée',
            ],
            'PasskeyAdded' => [
                'line' => 'Une clé d\'accès a été ajoutée à votre compte. Elle permet désormais de vous connecter.',
                'subject' => 'Une clé d\'accès a été ajoutée à votre compte',
            ],
            'PasskeyRemoved' => [
                'line' => 'Une clé d\'accès a été supprimée de votre compte. Elle ne permet plus de vous connecter.',
                'subject' => 'Une clé d\'accès a été supprimée de votre compte',
            ],
            'PasswordChanged' => [
                'line' => 'Le mot de passe de votre compte a été modifié. Toutes les autres sessions ont été déconnectées.',
                'subject' => 'Votre mot de passe a été modifié',
            ],
            'RecoveryCodeUsed' => [
                'line' => 'Un code de secours a servi à se connecter à votre compte à la place de la vérification en deux étapes. Ce code ne fonctionne plus.',
                'subject' => 'Un code de secours a servi à se connecter',
            ],
            'RecoveryCodesRegenerated' => [
                'line' => 'Un nouveau jeu de codes de secours a été généré pour votre compte. Les anciens codes ne fonctionnent plus.',
                'subject' => 'Vos codes de secours ont été remplacés',
            ],
            'TotpDisabled' => [
                'line' => 'L\'application d\'authentification a été désactivée pour votre compte. La connexion ne demande plus son code.',
                'subject' => 'Votre application d\'authentification a été désactivée',
            ],
            'TotpEnabled' => [
                'line' => 'Une application d\'authentification a été activée pour votre compte. La connexion demande désormais son code.',
                'subject' => 'Une application d\'authentification a été activée',
            ],
        ],
        'not_you' => 'Si c\'était vous, il n\'y a rien à faire. Sinon, changez votre mot de passe sans attendre et vérifiez les moyens de connexion à votre compte.',
        'when' => 'Date : :time',
    ],
    'test' => [
        'both' => 'Un test d\'envoi produit deux e-mails. Si seul le premier vous parvient, le serveur d\'envoi fonctionne mais le service de file d\'attente n\'est pas démarré.',
        'direct' => [
            'line' => 'Voici le premier des deux : l\'instance l\'a remis directement à son serveur d\'envoi, qui l\'a distribué.',
            'subject' => 'E-mail de test Opusline, 1 sur 2 : envoi direct',
        ],
        'queued' => [
            'line' => 'Voici le second des deux : il a été envoyé par la file d\'attente, comme le sont les alertes de sécurité et les rappels d\'échéances.',
            'subject' => 'E-mail de test Opusline, 2 sur 2 : envoi par la file d\'attente',
        ],
        'queue_failed' => 'Le serveur d\'envoi a accepté le premier e-mail, mais le second n\'a pas pu être remis à la file d\'attente : :reason',
        'relay_failed' => 'L\'e-mail de test n\'a pas pu être envoyé : :reason',
    ],
];
