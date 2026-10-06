<?php

declare(strict_types=1);

return [
    'deadlines' => [
        'action' => 'Open my deadlines',
        'due_in_days' => 'In :days days, on :date: :deadline',
        'due_today' => 'Today: :deadline',
        'due_tomorrow' => 'Tomorrow: :deadline',
        'footer' => 'You receive this email because deadline reminders are turned on in your notification settings.',
        'intro' => 'Here is what falls due soon on your account.',
        'invoice' => 'Invoice :number (:client)',
        'subject' => '{1} A deadline is coming up|[2,*] :count deadlines are coming up',
        'with_amount' => ':title. :amount',
    ],
    'password_reset' => [
        'action' => 'Choose a new password',
        'expires' => 'This link works once, for the next :count minutes.',
        'line' => 'A password reset was requested for your account. Use the button below to choose a new password.',
        'not_you' => 'If you did not ask for it, ignore this email: your password stays as it is.',
        'subject' => 'Reset your password',
    ],
    'security' => [
        'action' => 'Review my settings',
        'device' => 'Browser: :device',
        'ip' => 'IP address: :ip',
        'kind' => [
            'AlertsTurnedOff' => [
                'line' => 'Security alerts were turned off for your account. This is the last one you will receive until they are turned back on.',
                'subject' => 'Security alerts were turned off',
            ],
            'BrowserTrusted' => [
                'line' => 'A browser was marked as trusted on your account. It can sign in without the two-step verification until the trust expires.',
                'subject' => 'A browser was trusted on your account',
            ],
            'EmailChanged' => [
                'line' => 'The email address your account signs in with was changed to :email. This message was sent to the previous address, which no longer signs in.',
                'subject' => 'Your sign-in email was changed',
            ],
            'PasskeyAdded' => [
                'line' => 'A passkey was added to your account. It can now be used to sign in.',
                'subject' => 'A passkey was added to your account',
            ],
            'PasskeyRemoved' => [
                'line' => 'A passkey was removed from your account. It can no longer be used to sign in.',
                'subject' => 'A passkey was removed from your account',
            ],
            'PasswordChanged' => [
                'line' => 'The password of your account was changed. Every other session was signed out.',
                'subject' => 'Your password was changed',
            ],
            'RecoveryCodeUsed' => [
                'line' => 'A recovery code was used to sign in to your account in place of the two-step verification. That code no longer works.',
                'subject' => 'A recovery code was used to sign in',
            ],
            'RecoveryCodesRegenerated' => [
                'line' => 'A new set of recovery codes was generated for your account. The previous codes no longer work.',
                'subject' => 'Your recovery codes were replaced',
            ],
            'TotpDisabled' => [
                'line' => 'The authenticator app was turned off for your account. Signing in no longer asks for its code.',
                'subject' => 'Your authenticator app was turned off',
            ],
            'TotpEnabled' => [
                'line' => 'An authenticator app was turned on for your account. Signing in now asks for its code.',
                'subject' => 'An authenticator app was turned on',
            ],
        ],
        'not_you' => 'If this was you, there is nothing to do. If it was not, change your password now and review how your account can be signed in to.',
        'when' => 'When: :time',
    ],
    'test' => [
        'both' => 'A mail test sends two emails. If only the first one reaches you, the mail relay works but the queue service is not running.',
        'direct' => [
            'line' => 'This is the first of the two: the instance handed it straight to its mail relay, and the relay delivered it.',
            'subject' => 'Opusline test email, 1 of 2: sent directly',
        ],
        'queued' => [
            'line' => 'This is the second of the two: the queue worker sent it, the way it sends security alerts and deadline reminders.',
            'subject' => 'Opusline test email, 2 of 2: sent by the queue',
        ],
        'queue_failed' => 'The mail relay accepted the first email, but the second could not be handed to the queue: :reason',
        'relay_failed' => 'The test email could not be sent: :reason',
    ],
];
