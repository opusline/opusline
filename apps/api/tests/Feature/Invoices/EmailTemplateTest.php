<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\EmailTemplate;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

function invoicingUser(array $settings = []): User
{
    $user = User::factory()->create(['name' => 'Camille Aubrac']);
    $user->settingsOrFail()->update($settings);

    return $user;
}

test('lists one template per kind, the built-in copy in the documents\' language until reworded', function (): void {
    $user = invoicingUser(['document_language' => DocumentLanguage::English]);
    EmailTemplate::factory()->for($user)->create(['kind' => EmailTemplateKind::NewQuote, 'subject' => 'Our quote {numero}']);
    EmailTemplate::factory()->create(['kind' => EmailTemplateKind::NewInvoice, 'subject' => 'Someone else\'s']);

    $this->actingAs($user)
        ->getJson('/api/invoicing/emails')
        ->assertOk()
        ->assertJsonCount(4, 'templates')
        ->assertJsonPath('templates.0.kind', EmailTemplateKind::NewInvoice->value)
        ->assertJsonPath('templates.0.subject', 'Invoice {numero}')
        ->assertJsonPath('templates.0.isCustom', false)
        ->assertJsonPath('templates.0.variables', ['numero', 'titre', 'montant', 'echeance', 'client', 'contact'])
        ->assertJsonPath('templates.1.subject', 'Our quote {numero}')
        ->assertJsonPath('templates.1.isCustom', true);
});

test('defaults read in French when the documents are French', function (): void {
    $user = invoicingUser(['document_language' => DocumentLanguage::French]);

    $this->actingAs($user)
        ->getJson('/api/invoicing/emails')
        ->assertOk()
        ->assertJsonPath('templates.3.subject', 'Relance · facture {numero}');
});

test('rewords a template', function (): void {
    $user = invoicingUser();

    $this->actingAs($user)
        ->putJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value, [
            'subject' => '  Votre facture {numero} ',
            'body' => "Bonjour {client},\nVoici {montant} à régler avant le {echeance}.\n{contact}",
        ])
        ->assertOk()
        ->assertJsonPath('subject', 'Votre facture {numero}')
        ->assertJsonPath('isCustom', true);

    expect($user->emailTemplates()->where('kind', EmailTemplateKind::NewInvoice)->count())->toBe(1);
});

test('rewording again replaces the wording rather than adding a second one', function (): void {
    $user = invoicingUser();

    foreach (['Première version {numero}', 'Seconde version {numero}'] as $subject) {
        $this->actingAs($user)
            ->putJson('/api/invoicing/emails/'.EmailTemplateKind::NewQuote->value, ['subject' => $subject, 'body' => 'Bonjour {client}'])
            ->assertOk();
    }

    expect($user->emailTemplates()->count())->toBe(1)
        ->and($user->emailTemplates()->sole()->subject)->toBe('Seconde version {numero}');
});

test('refuses a placeholder the e-mail cannot fill, on the field that carries it', function (): void {
    $user = invoicingUser();

    $this->actingAs($user)
        ->putJson('/api/invoicing/emails/'.EmailTemplateKind::NewQuote->value, [
            'subject' => 'Devis {numero}',
            'body' => 'Échéance {echeance}',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['body'])
        ->assertJsonPath('errors.body.0', __('client_mail.unknown_variable', [
            'name' => '{echeance}',
            'known' => '{numero}, {titre}, {montant}, {validite}, {client}, {contact}',
        ]));
});

test('refuses an empty or oversized wording', function (array $payload, string $field): void {
    $user = invoicingUser();

    $this->actingAs($user)
        ->putJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value, $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$field]);
})->with([
    'no subject' => [['subject' => '', 'body' => 'Bonjour'], 'subject'],
    'no body' => [['subject' => 'Facture', 'body' => ''], 'body'],
    'a subject longer than a line' => [['subject' => str_repeat('a', 256), 'body' => 'Bonjour'], 'subject'],
    'a body longer than a letter' => [['subject' => 'Facture', 'body' => str_repeat('a', 5001)], 'body'],
]);

test('knows no fifth kind of e-mail', function (): void {
    $user = invoicingUser();

    $this->actingAs($user)->putJson('/api/invoicing/emails/9', ['subject' => 'x', 'body' => 'y'])->assertNotFound();
    $this->actingAs($user)->getJson('/api/invoicing/emails/9/preview')->assertNotFound();
});

test('resetting a template brings the built-in copy back', function (): void {
    $user = invoicingUser(['document_language' => DocumentLanguage::English]);
    EmailTemplate::factory()->for($user)->create(['kind' => EmailTemplateKind::CreditNote]);

    $this->actingAs($user)
        ->deleteJson('/api/invoicing/emails/'.EmailTemplateKind::CreditNote->value)
        ->assertOk()
        ->assertJsonPath('subject', 'Credit note {numero}')
        ->assertJsonPath('isCustom', false);

    expect($user->emailTemplates()->count())->toBe(0);
});

test('resetting leaves another account\'s wording alone', function (): void {
    $user = invoicingUser();
    $other = EmailTemplate::factory()->create(['kind' => EmailTemplateKind::NewInvoice]);

    $this->actingAs($user)->deleteJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value)->assertOk();

    expect(EmailTemplate::query()->whereKey($other->id)->exists())->toBeTrue();
});

test('previews the e-mail with sample figures, dates counted from today', function (): void {
    $user = invoicingUser(['document_language' => DocumentLanguage::French, 'trade_name' => 'Studio Lorem']);

    $response = $this->actingAs($user)
        ->getJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value.'/preview')
        ->assertOk()
        ->assertJsonPath('subject', 'Facture F-2026-014');

    expect($response->json('text'))
        ->toContain('Bonjour Nordlys,')
        ->toContain("1\u{00A0}440,00\u{00A0}€")
        ->toContain('09/09/2026')
        ->toContain('Studio Lorem')
        ->and($response->json('html'))
        ->toContain('Facture F-2026-014')
        ->toContain('Montant TTC')
        ->toContain('Envoyé avec Opusline pour le compte de Studio Lorem.')
        ->not->toContain('{numero}');
});

test('the reminder names the days late and the e-mails that ask for money carry the IBAN', function (): void {
    $user = invoicingUser(['document_language' => DocumentLanguage::English, 'iban' => 'FR7630006000011234567890189', 'bic' => 'AGRIFRPP', 'show_iban_on_invoices' => true]);

    $reminder = $this->actingAs($user)->getJson('/api/invoicing/emails/'.EmailTemplateKind::PaymentReminder->value.'/preview')->assertOk();
    $quote = $this->actingAs($user)->getJson('/api/invoicing/emails/'.EmailTemplateKind::NewQuote->value.'/preview')->assertOk();

    expect($reminder->json('text'))->toContain('late by 12 days')
        ->and($reminder->json('html'))->toContain('FR7630006000011234567890189')->toContain('Payment by bank transfer')
        ->and($quote->json('html'))->not->toContain('FR7630006000011234567890189');
});

test('shows initials in place of a logo nobody uploaded', function (): void {
    expect(ClientDocumentMail::initials('Théo Marchand'))->toBe('TM')
        ->and(ClientDocumentMail::initials('studio-lorem'))->toBe('SL')
        ->and(ClientDocumentMail::initials('Nordlys'))->toBe('N');
});

test('sends the sample e-mail to the account itself, from the instance in the account\'s name, replies to its contact address', function (): void {
    Mail::fake();
    config()->set('mail.enabled', true);
    config()->set('mail.from.address', 'opusline@example.test');
    $user = invoicingUser(['trade_name' => 'Studio Lorem', 'contact_email' => 'bonjour@studio-lorem.test']);

    $this->actingAs($user)
        ->postJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value.'/test')
        ->assertNoContent();

    Mail::assertSent(ClientDocumentMail::class, function (ClientDocumentMail $mail) use ($user): bool {
        $envelope = $mail->envelope();

        return $mail->hasTo($user->email)
            && $envelope->from?->address === 'opusline@example.test'
            && $envelope->from->name === 'Studio Lorem'
            && $envelope->replyTo[0]->address === 'bonjour@studio-lorem.test'
            && $envelope->subject === 'Facture F-2026-014'
            && $mail->content->isTest;
    });
});

test('replies go to the sign-in address when no contact address is set', function (): void {
    Mail::fake();
    config()->set('mail.enabled', true);
    $user = invoicingUser(['contact_email' => null, 'trade_name' => null]);

    $this->actingAs($user)->postJson('/api/invoicing/emails/'.EmailTemplateKind::NewQuote->value.'/test')->assertNoContent();

    Mail::assertSent(ClientDocumentMail::class, function (ClientDocumentMail $mail) use ($user): bool {
        $envelope = $mail->envelope();

        return $envelope->replyTo[0]->address === $user->email && $envelope->from?->name === 'Camille Aubrac';
    });
});

test('a line break typed into the trade name or the subject never becomes a header', function (): void {
    Mail::fake();
    config()->set('mail.enabled', true);
    $user = invoicingUser(['trade_name' => "Studio Lorem\r\nBcc: spy@example.test"]);
    EmailTemplate::factory()->for($user)->create(['kind' => EmailTemplateKind::NewInvoice, 'subject' => "Facture {numero}\nX-Injected: yes"]);

    $this->actingAs($user)->postJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value.'/test')->assertNoContent();

    Mail::assertSent(ClientDocumentMail::class, function (ClientDocumentMail $mail): bool {
        $envelope = $mail->envelope();

        return $envelope->from?->name === 'Studio Lorem Bcc: spy@example.test'
            && $envelope->subject === 'Facture F-2026-014 X-Injected: yes';
    });
});

test('the test send does not exist on an instance that sends no mail', function (): void {
    Mail::fake();
    config()->set('mail.enabled', false);
    $user = invoicingUser();

    $this->actingAs($user)->postJson('/api/invoicing/emails/'.EmailTemplateKind::NewInvoice->value.'/test')->assertNotFound();

    Mail::assertNothingSent();
});
