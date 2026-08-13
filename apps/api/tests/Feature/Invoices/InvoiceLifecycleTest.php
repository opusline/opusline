<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('marks a draft as sent', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->state(['number' => '2026-007']));

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/send")
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Sent->value)
        ->assertJsonPath('history.0.kind', InvoiceEventKind::Sent->value);
});

test('refuses to send a draft that has no reference', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/send")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.number_required_once_issued'));
});

test('refuses to send an invoice that is already sent', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/send")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_send_unless_draft'));
});

test('marks a sent invoice as paid', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $paidOn = CarbonImmutable::today()->toDateString();

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => $paidOn])
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value)
        ->assertJsonPath('invoice.paidOn', $paidOn);
});

test('requires a payment date to mark an invoice paid', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay")
        ->assertStatus(422)
        ->assertJsonValidationErrors('paidOn');
});

test('refuses a payment date in the future', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", [
            'paidOn' => CarbonImmutable::today()->addDay()->toDateString(),
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('paidOn');
});

test('refuses to pay a draft', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => CarbonImmutable::today()->toDateString()])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_pay_unless_sent'));
});

test('notes a reminder on a sent invoice', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/reminders", [
            'occurredOn' => '2026-08-11',
            'note' => 'Relance par email',
        ])
        ->assertCreated()
        ->assertJsonPath('history.0.kind', InvoiceEventKind::Reminded->value)
        ->assertJsonPath('history.0.note', 'Relance par email');
});

test('refuses a reminder on a draft', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/reminders")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_remind'));
});

test('refuses a reminder on a paid invoice', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/reminders")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_remind'));
});

test('records one event per transition', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $invoice = $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'number' => '2026-021',
            'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
        ])
        ->json('invoice.id');

    $this->postJson("/api/invoices/{$invoice}/send")->assertOk();
    $history = $this->postJson("/api/invoices/{$invoice}/pay", ['paidOn' => CarbonImmutable::today()->toDateString()])
        ->assertOk()
        ->json('history');

    expect(array_column($history, 'kind'))->toBe([
        InvoiceEventKind::Created->value,
        InvoiceEventKind::Sent->value,
        InvoiceEventKind::Paid->value,
    ]);
});

test('returns the history in chronological order', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    // Inserted newest-first, so an unordered relation would hand them back that way.
    foreach (['2026-08-10', '2026-06-05', '2026-07-20'] as $date) {
        $invoice->events()->create([
            'kind' => InvoiceEventKind::Reminded,
            'occurred_on' => $date,
        ]);
    }

    $history = $this->actingAs($user)
        ->getJson("/api/invoices/{$invoice->id}")
        ->assertOk()
        ->json('history');

    expect(array_column($history, 'occurredOn'))->toBe(['2026-06-05', '2026-07-20', '2026-08-10']);
});
