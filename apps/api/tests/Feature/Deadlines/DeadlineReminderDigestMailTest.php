<?php

declare(strict_types=1);

use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('the reminder email names each deadline in the language of the account', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-30 12:00:00', 'UTC'));
    config()->set('app.frontend_url', 'https://opusline.example');
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => Locale::fr_FR]);
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory) => $factory->sent()->state([
        'number' => 'F-2026-014',
        'due_on' => '2026-09-06',
    ]));

    $this->artisan('deadlines:send-reminders')->assertSuccessful();

    $mail = soleSentMail();

    expect($mail->getTo()[0]->getAddress())->toBe($user->email)
        ->and($mail->getSubject())->toBe('2 échéances approchent')
        ->and($mail->getTextBody())
        ->toContain('Demain : Déclaration URSSAF — juillet 2026')
        ->toContain('Dans 7 jours, le 6 septembre 2026 : Facture F-2026-014')
        ->toContain('https://opusline.example/deadlines');
});
