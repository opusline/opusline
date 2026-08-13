<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('updates an invoice and recomputes the gross amount', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'amountHt' => ['amount' => 200_000, 'currency' => 'EUR'],
            'vatRateBp' => 2000,
        ])
        ->assertOk()
        ->assertJsonPath('invoice.amountHt.amount', 200_000)
        ->assertJsonPath('invoice.amountTtc.amount', 240_000);
});

test('keeps a re-supplied gross amount override', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'amountHt' => ['amount' => 200_000, 'currency' => 'EUR'],
            'amountTtc' => ['amount' => 239_998, 'currency' => 'EUR'],
        ])
        ->assertOk()
        ->assertJsonPath('invoice.amountTtc.amount', 239_998)
        ->assertJsonPath('invoice.ttcOverridden', true);
});

test('drops the override when the gross amount is omitted', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->state([
        'amount_ttc_cents' => 197_999,
    ]));

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
            'vatRateBp' => 2000,
        ])
        ->assertOk()
        ->assertJsonPath('invoice.amountTtc.amount', 198_000)
        ->assertJsonPath('invoice.ttcOverridden', false);
});

test('records a correction when the money changes', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'amountHt' => ['amount' => 300_000, 'currency' => 'EUR'],
        ])
        ->assertOk();

    expect($invoice->events()->where('kind', InvoiceEventKind::Updated)->exists())->toBeTrue();
});

test('does not record a correction when only the note changes', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
            'notes' => 'Payée par virement',
        ])
        ->assertOk();

    expect($invoice->events()->where('kind', InvoiceEventKind::Updated)->exists())->toBeFalse();
});

test('edits a past invoice without resending its issue date', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-13'));

    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->state([
        'issued_on' => '2026-06-01',
        'due_on' => '2026-07-16',
    ]));

    // The due date is unchanged and the issue date omitted: the stored 2026-06-01 is
    // what it has to be compared against, not today.
    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'dueOn' => '2026-07-16',
            'amountHt' => ['amount' => 180_000, 'currency' => 'EUR'],
        ])
        ->assertOk()
        ->assertJsonPath('invoice.issuedOn', '2026-06-01')
        ->assertJsonPath('invoice.dueOn', '2026-07-16');
});

test('still refuses a due date before the stored issue date', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->state([
        'issued_on' => '2026-06-01',
    ]));

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'dueOn' => '2026-05-20',
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('dueOn');
});

test('refuses to move an invoice that still bills tracked time', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $invoice = invoiceForMission($user, $mission);

    invoicedTimeEntry($user, $mission, $invoice);

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'missionId' => null,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('missionId');
});

test('refuses a reference already used by another invoice', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->state(['number' => '2026-030']));
    $invoice = invoiceOwnedBy($user, $client);

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'number' => '2026-030',
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('number');
});

test('keeps its own reference on update', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->state(['number' => '2026-031']));

    $this->actingAs($user)
        ->putJson("/api/invoices/{$invoice->id}", [
            'clientId' => $invoice->client_id,
            'number' => '2026-031',
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertOk()
        ->assertJsonPath('invoice.number', '2026-031');
});
