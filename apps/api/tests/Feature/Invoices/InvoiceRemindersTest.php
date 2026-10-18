<?php

declare(strict_types=1);

use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Invoices\Mail\ClientDocumentMail;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    // Noon UTC, 14:00 in Paris: every account's morning has started.
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
    Mail::fake();
    config()->set('mail.enabled', true);
});

/**
 * An invoice issued and e-mailed on 1 August with a 30-day term: due on 31 August.
 * A test that travels on afterwards refreshes its user: the settings cached on
 * the instance remember the day they were loaded, as a request never outlives one.
 */
function remindableInvoice(User $user, ReminderFrequency $frequency = ReminderFrequency::OnceDayAfterDue, array $client = []): Invoice
{
    test()->travelTo('2026-08-01 12:00:00');
    $id = draftFor($user, billableClient($user, ['billing_email' => 'compta@nordlys.test', ...$client]), ['title' => 'Refonte du site']);
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/email", [
        'recipients' => ['compta@nordlys.test'],
        'remindersEnabled' => true,
        'remindersFrequency' => $frequency->value,
    ])->assertCreated();
    Mail::fake();

    return Invoice::query()->findOrFail($id);
}

function remindersSent(Invoice $invoice): int
{
    return $invoice->emails()->where('kind', EmailTemplateKind::PaymentReminder)->count();
}

test('tells the day the next reminder leaves', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user, ReminderFrequency::DayThreeAndTen);

    $this->actingAs($user)->getJson("/api/invoices/{$invoice->id}")->assertOk()->assertJsonPath('nextReminderOn', '2026-09-03');
});

test('changes an invoice\'s reminders without touching the others', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user);

    $this->actingAs($user)
        ->putJson("/api/invoicing/invoices/{$invoice->id}/reminders", ['enabled' => false, 'frequency' => ReminderFrequency::WeeklyUntilPaid->value])
        ->assertOk()
        ->assertJsonPath('invoice.remindersEnabled', false)
        ->assertJsonPath('invoice.remindersFrequency', ReminderFrequency::WeeklyUntilPaid->value)
        ->assertJsonPath('nextReminderOn', null);
});

test('reminds now, with the reminder template and the PDF, and writes it into the history', function (): void {
    $user = issuableAccount(['trade_name' => 'Studio Lorem']);
    $invoice = remindableInvoice($user);
    $this->travelTo('2026-09-12 12:00:00');
    $user->refresh();

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/reminders/send")
        ->assertCreated()
        ->assertJsonPath('kind', EmailTemplateKind::PaymentReminder->value)
        ->assertJsonPath('recipients', ['compta@nordlys.test'])
        ->assertJsonPath('subject', 'Relance : facture 2026-001 en attente de paiement');

    Mail::assertQueued(ClientDocumentMail::class, fn (ClientDocumentMail $mail): bool => $mail->hasTo('compta@nordlys.test')
        && $mail->content->kind === EmailTemplateKind::PaymentReminder
        && ($mail->content->flag['label'] ?? null) === 'En retard de 12 j'
        && count($mail->attachments()) === 1);

    $history = collect($this->actingAs($user)->getJson("/api/invoices/{$invoice->id}")->json('history'));
    expect($history->firstWhere('kind', InvoiceEventKind::Reminded->value)['note'])->toBe('compta@nordlys.test');
});

test('reminds a partly paid invoice of what is left, not of its total', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user);
    $this->travelTo('2026-09-12 12:00:00');
    $user->refresh();
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-09-05',
        'amount' => ['amount' => 10_000, 'currency' => 'EUR'],
    ])->assertOk();
    $left = $invoice->refresh()->balanceDue();

    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/reminders/send")->assertCreated();

    $due = (new DocumentFormatter(DocumentLanguage::French, $user->settingsOrFail()->date_format))->money($left);
    Mail::assertQueued(ClientDocumentMail::class, fn (ClientDocumentMail $mail): bool => $mail->content->amount === $due
        && str_contains(implode(' ', $mail->content->paragraphs), "il reste {$due} TTC"));
});

test('has nobody to remind on an invoice that never left Opusline', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/reminders/send")
        ->assertConflict()
        ->assertJsonPath('message', __('client_mail.no_reminder_recipients'));
});

test('the schedule reminds the day after the due date, once', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user);

    $this->travelTo('2026-08-31 12:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(0);

    $this->travelTo('2026-09-01 12:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(1);
    Mail::assertQueued(ClientDocumentMail::class, 1);

    $this->travelTo('2026-09-15 12:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(1);
});

test('the weekly rhythm keeps going until the invoice is paid', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user, ReminderFrequency::WeeklyUntilPaid);

    foreach (['2026-09-07', '2026-09-14'] as $day) {
        $this->travelTo("{$day} 12:00:00");
        $this->artisan('invoices:send-reminders')->assertSuccessful();
    }
    expect(remindersSent($invoice))->toBe(2);

    $user->refresh();
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-09-14'])->assertOk();

    $this->travelTo('2026-09-21 12:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(2);
});

test('a reminder sent by hand counts: the next automatic one moves along', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user, ReminderFrequency::DayThreeAndTen);

    $this->travelTo('2026-09-05 12:00:00');
    $user->refresh();
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/reminders/send")->assertCreated();
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(1)
        ->and($this->actingAs($user)->getJson("/api/invoices/{$invoice->id}")->json('nextReminderOn'))->toBe('2026-09-10');
});

test('waits for the account\'s morning', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user);

    // 06:00 UTC is 08:00 in Paris, before the reminder hour.
    $this->travelTo('2026-09-01 06:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(0);

    $this->travelTo('2026-09-01 08:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();
    expect(remindersSent($invoice))->toBe(1);
});

test('leaves alone the invoices whose reminders are off', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user);
    $this->actingAs($user)->putJson("/api/invoicing/invoices/{$invoice->id}/reminders", ['enabled' => false, 'frequency' => ReminderFrequency::OnceDayAfterDue->value])->assertOk();

    $this->travelTo('2026-09-01 12:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();

    expect(remindersSent($invoice))->toBe(0);
    Mail::assertNothingQueued();
});

test('sends nothing on an instance that sends no mail', function (): void {
    $user = issuableAccount();
    $invoice = remindableInvoice($user);
    config()->set('mail.enabled', false);

    $this->travelTo('2026-09-01 12:00:00');
    $this->artisan('invoices:send-reminders')->assertSuccessful();

    expect(remindersSent($invoice))->toBe(0);
    expect(DocumentEmail::query()->where('kind', EmailTemplateKind::PaymentReminder)->count())->toBe(0);
});
