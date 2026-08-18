<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('creates a draft invoice for a client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.status', InvoiceStatus::Draft->value)
        ->assertJsonPath('invoice.clientId', $client->id)
        ->assertJsonPath('invoice.amountHt.amount', 165_000)
        ->assertJsonPath('invoice.number', null);
});

test('derives the due date from the client payment terms', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['payment_terms_days' => 30]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'issuedOn' => '2026-08-01',
            'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.dueOn', '2026-08-31');
});

test('computes the gross amount from the account TVA rate', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 2000)
        ->assertJsonPath('invoice.amountVat.amount', 33_000)
        ->assertJsonPath('invoice.amountTtc.amount', 198_000)
        ->assertJsonPath('invoice.ttcOverridden', false);
});

test('keeps a supplied gross amount verbatim', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
            'amountTtc' => ['amount' => 197_999, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.amountTtc.amount', 197_999)
        ->assertJsonPath('invoice.amountVat.amount', 32_999)
        ->assertJsonPath('invoice.ttcOverridden', true);
});

test('charges no TVA to a client billed at zero', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $client = Client::factory()->for($user)->create(['default_vat_rate_bp' => 0]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 0)
        ->assertJsonPath('invoice.amountVat.amount', 0)
        ->assertJsonPath('invoice.amountTtc.amount', 165_000);
});

test('bills a client at its own rate rather than the account default', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $client = Client::factory()->for($user)->create(['default_vat_rate_bp' => 550]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 550)
        ->assertJsonPath('invoice.amountVat.amount', 5_500);
});

test('a rate on the request beats the client own rate', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $client = Client::factory()->for($user)->create(['default_vat_rate_bp' => 0]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
            'vatRateBp' => 2_000,
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 2_000)
        ->assertJsonPath('invoice.amountVat.amount', 20_000);
});

test('the franchise en base outranks a client own rate', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['default_vat_rate_bp' => 2_000]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 0)
        ->assertJsonPath('invoice.amountVat.amount', 0);
});

test('charges no TVA under the franchise en base', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 0)
        ->assertJsonPath('invoice.amountVat.amount', 0)
        ->assertJsonPath('invoice.amountTtc.amount', 165_000);
});

/**
 * @param  array<string, mixed>  $payload
 */
test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
            ...$payload,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'gross below net' => [['amountTtc' => ['amount' => 164_000, 'currency' => 'EUR']], 'amountTtc'],
    'issued without a reference' => [['status' => InvoiceStatus::Sent->value], 'number'],
    'paid without a payment date' => [['number' => '2026-015', 'status' => InvoiceStatus::Paid->value], 'paidOn'],
    'payment date in the future' => [[
        'number' => '2026-090',
        'status' => InvoiceStatus::Paid->value,
        'paidOn' => '2099-01-01',
    ], 'paidOn'],
    'payment date on an unpaid invoice' => [['paidOn' => '2026-01-01'], 'paidOn'],
    'payment date before the issue date' => [[
        'number' => '2026-092',
        'status' => InvoiceStatus::Paid->value,
        'issuedOn' => '2026-06-01',
        'paidOn' => '2026-05-20',
    ], 'paidOn'],
    'due date before the issue date' => [['issuedOn' => '2026-08-13', 'dueOn' => '2026-08-12'], 'dueOn'],
]);

test('refuses a mission belonging to another client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherMission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'missionId' => $otherMission->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('missionId');
});

test('refuses a client belonging to another user', function (): void {
    $user = User::factory()->create();
    $foreignClient = Client::factory()->for(User::factory()->create())->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $foreignClient->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('clientId');
});

test('refuses a reference already used by another invoice', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->state(['number' => '2026-001']));

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'number' => '2026-001',
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('number');
});

test('records the invoice creation in its history', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonCount(1, 'history')
        ->assertJsonPath('history.0.kind', InvoiceEventKind::Created->value);
});

test('dates a back-filled timeline from the invoice, not from today', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-13'));

    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $history = $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $client->id,
            'number' => '2026-014',
            'status' => InvoiceStatus::Paid->value,
            'issuedOn' => '2026-06-01',
            'paidOn' => '2026-07-02',
            'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value)
        ->assertJsonPath('invoice.paidOn', '2026-07-02')
        ->json('history');

    expect(array_column($history, 'kind'))->toBe([
        InvoiceEventKind::Created->value,
        InvoiceEventKind::Sent->value,
        InvoiceEventKind::Paid->value,
    ])->and(array_column($history, 'occurredOn'))->toBe(['2026-06-01', '2026-06-01', '2026-07-02']);
});
