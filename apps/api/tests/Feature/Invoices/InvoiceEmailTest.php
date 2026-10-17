<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
    Mail::fake();
    config()->set('mail.enabled', true);
});

/** An invoice validated in Opusline: numbered, with its PDF filed. */
function issuedInvoiceFor(User $user, array $client = []): Invoice
{
    $id = draftFor($user, billableClient($user, ['billing_email' => 'compta@nordlys.test', 'billing_contact_name' => 'Sophie Reix', ...$client]), ['title' => 'Refonte du site']);
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    return Invoice::query()->findOrFail($id);
}

function sendInvoiceEmail(User $user, Invoice $invoice, array $payload = []): TestResponse
{
    return test()->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/email", [
        'recipients' => ['compta@nordlys.test'],
        ...$payload,
    ]);
}

test('previews the e-mail an invoice would go out in, filled with its own figures', function (): void {
    $user = issuableAccount(['trade_name' => 'Studio Lorem']);
    $invoice = issuedInvoiceFor($user);

    $response = $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/email/preview", ['body' => 'Bonjour {contact}, voici {numero} ({titre}) : {montant}, avant le {echeance}.'])
        ->assertOk()
        ->assertJsonPath('subject', 'Facture 2026-001 (Refonte du site)');

    expect($response->json('text'))
        ->toBe("Bonjour Sophie Reix, voici 2026-001 (Refonte du site) : 12\u{00A0}540,00\u{00A0}€, avant le 09/09/2026.")
        ->and($response->json('html'))->toContain('Facture 2026-001')->toContain('2026-001.pdf');
});

test('sends the invoice with its PDF to the recipients, a copy to the account when asked', function (): void {
    $user = issuableAccount(['trade_name' => 'Studio Lorem']);
    $invoice = issuedInvoiceFor($user);

    sendInvoiceEmail($user, $invoice, ['recipients' => ['compta@nordlys.test', 'sophie@nordlys.test'], 'copyToSender' => true])
        ->assertCreated()
        ->assertJsonPath('kind', EmailTemplateKind::NewInvoice->value)
        ->assertJsonPath('recipients', ['compta@nordlys.test', 'sophie@nordlys.test'])
        ->assertJsonPath('copyToSender', true)
        ->assertJsonPath('subject', 'Facture 2026-001 (Refonte du site)');

    Mail::assertQueued(ClientDocumentMail::class, fn (ClientDocumentMail $mail): bool => $mail->hasTo('compta@nordlys.test')
        && $mail->hasTo('sophie@nordlys.test')
        && $mail->hasCc($user->email)
        && count($mail->attachments()) === 1
        && ! $mail->content->isTest);
});

test('keeps the e-mail as it left and writes it into the invoice history', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceFor($user);

    sendInvoiceEmail($user, $invoice, ['subject' => 'Votre facture {numero}', 'body' => 'Bonjour {contact},'])->assertCreated();

    $detail = $this->actingAs($user)->getJson("/api/invoices/{$invoice->id}")->assertOk();

    expect($detail->json('emails'))->toHaveCount(1)
        ->and($detail->json('emails.0.subject'))->toBe('Votre facture 2026-001')
        ->and($detail->json('emails.0.recipients'))->toBe(['compta@nordlys.test'])
        ->and(collect($detail->json('history'))->pluck('kind'))->toContain(InvoiceEventKind::Emailed->value)
        ->and(collect($detail->json('history'))->firstWhere('kind', InvoiceEventKind::Emailed->value)['note'])->toBe('compta@nordlys.test');
});

test('settles the reminders from the account defaults unless the send says otherwise', function (): void {
    $user = issuableAccount(['reminders_default_enabled' => true, 'reminders_default_frequency' => ReminderFrequency::WeeklyUntilPaid]);
    $byDefault = issuedInvoiceFor($user);
    $explicit = issuedInvoiceFor($user, ['name' => 'Callisto']);

    sendInvoiceEmail($user, $byDefault)->assertCreated();
    sendInvoiceEmail($user, $explicit, ['remindersEnabled' => false, 'remindersFrequency' => ReminderFrequency::DayThreeAndTen->value])->assertCreated();

    expect($byDefault->refresh())
        ->reminders_enabled->toBeTrue()
        ->reminders_frequency->toBe(ReminderFrequency::WeeklyUntilPaid)
        ->reminder_recipients->toBe(['compta@nordlys.test'])
        ->and($explicit->refresh())
        ->reminders_enabled->toBeFalse()
        ->reminders_frequency->toBe(ReminderFrequency::DayThreeAndTen);
});

test('refuses to send a draft written in Opusline: validating is what issues it', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/email", ['recipients' => ['compta@nordlys.test']])
        ->assertConflict()
        ->assertJsonPath('message', __('client_mail.validate_before_sending'));

    Mail::assertNothingQueued();
});

test('an invoice recorded from another tool is not sent from here: that tool sent it', function (): void {
    $user = issuableAccount();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-037']));
    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", ['file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf')])
        ->assertCreated();

    sendInvoiceEmail($user, $invoice)->assertConflict()->assertJsonPath('message', __('client_mail.written_elsewhere'));

    Mail::assertNothingQueued();
});

test('a quote recorded from another tool is not sent from here either', function (): void {
    $user = issuableAccount();
    $quote = Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->external()->create();

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/email", ['recipients' => ['compta@nordlys.test']])
        ->assertConflict()
        ->assertJsonPath('message', __('client_mail.written_elsewhere'));
});

test('refuses recipients that are not plain addresses', function (array $recipients): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceFor($user);

    sendInvoiceEmail($user, $invoice, ['recipients' => $recipients])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['recipients.0']);

    Mail::assertNothingQueued();
})->with([
    'a header injection' => [["compta@nordlys.test\r\nBcc: spy@example.test"]],
    'a bare name' => [['Sophie Reix']],
    'the same address twice' => [['compta@nordlys.test', 'Compta@nordlys.test']],
]);

test('needs at least one recipient', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceFor($user);

    sendInvoiceEmail($user, $invoice, ['recipients' => []])->assertUnprocessable()->assertJsonValidationErrors(['recipients']);
});

test('sends the test e-mail to the account itself and records nothing', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceFor($user);

    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/email/test", ['subject' => 'Essai {numero}'])->assertNoContent();

    Mail::assertSent(ClientDocumentMail::class, fn (ClientDocumentMail $mail): bool => $mail->hasTo($user->email) && $mail->content->isTest && $mail->envelope()->subject === 'Essai 2026-001');
    expect($invoice->emails()->count())->toBe(0);
});

test('keeps another account\'s invoice out of reach', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceFor(issuableAccount());

    sendInvoiceEmail($user, $invoice)->assertNotFound();
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/email/preview")->assertNotFound();
});

test('sending does not exist on an instance that sends no mail', function (): void {
    config()->set('mail.enabled', false);
    $user = issuableAccount();
    $invoice = issuedInvoiceFor($user);

    sendInvoiceEmail($user, $invoice)->assertNotFound();
});

test('a validated quote goes out the same way, its PDF attached', function (): void {
    $user = issuableAccount();
    $quoteId = quoteDraftFor($user, billableClient($user, ['billing_contact_name' => 'Sophie Reix']), ['title' => "Refonte de l'espace client"]);
    $this->actingAs($user)->postJson("/api/invoicing/quotes/{$quoteId}/issue")->assertOk();

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quoteId}/email", ['recipients' => ['compta@nordlys.test']])
        ->assertCreated()
        ->assertJsonPath('kind', EmailTemplateKind::NewQuote->value)
        ->assertJsonPath('subject', "Devis D-2026-001 (Refonte de l'espace client)");

    Mail::assertQueued(ClientDocumentMail::class, fn (ClientDocumentMail $mail): bool => $mail->hasTo('compta@nordlys.test') && count($mail->attachments()) === 1);
    expect($this->actingAs($user)->getJson("/api/invoicing/quotes/{$quoteId}")->json('emails'))->toHaveCount(1);
});

test('a quote still in draft has nothing to send', function (): void {
    $user = issuableAccount();
    $quoteId = quoteDraftFor($user, billableClient($user));

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quoteId}/email", ['recipients' => ['compta@nordlys.test']])
        ->assertConflict();
});
