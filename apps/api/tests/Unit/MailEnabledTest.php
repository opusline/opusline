<?php

declare(strict_types=1);

/**
 * config/mail.php as it would be read with the given MAIL_MAILER. The file is
 * evaluated again rather than read from the booted config, because the switch
 * is decided from the environment once, at boot.
 */
function mailEnabledWith(?string $mailer): bool
{
    $before = getenv('MAIL_MAILER');

    // phpunit.xml's value reaches env() through all three of these.
    unset($_ENV['MAIL_MAILER'], $_SERVER['MAIL_MAILER']);
    putenv($mailer === null ? 'MAIL_MAILER' : "MAIL_MAILER={$mailer}");

    try {
        return (require dirname(__DIR__, 2).'/config/mail.php')['enabled'];
    } finally {
        if ($before !== false) {
            putenv("MAIL_MAILER={$before}");
            $_ENV['MAIL_MAILER'] = $_SERVER['MAIL_MAILER'] = $before;
        }
    }
}

test('an instance sends mail only when its operator named a mailer that delivers', function (?string $mailer, bool $isEnabled): void {
    expect(mailEnabledWith($mailer))->toBe($isEnabled);
})->with([
    'no mailer named' => [null, false],
    'an empty mailer' => ['', false],
    'the log mailer, which would write reset links to the log' => ['log', false],
    'an SMTP relay' => ['smtp', true],
    'a transactional mail service' => ['postmark', true],
]);
