<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankMatchReason;
use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

function importCsv(User $user, string $csv): TestResponse
{
    return test()->actingAs($user)->post(
        '/api/bank/statements',
        ['file' => UploadedFile::fake()->createWithContent('releve.csv', $csv)],
        ['Accept' => 'application/json'],
    );
}

function csvWithMovements(string ...$lines): string
{
    return "Date;Libellé;Montant\n".implode("\n", $lines)."\n";
}

test('suggests on the invoice reference found in the label', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));

    importCsv($user, csvWithMovements('08/08/2026;VIR SEPA CLIENT QUELCONQUE REF 2026041;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.reason', BankMatchReason::RefInLabel->value)
        ->assertJsonPath('account.pendingMatches.0.invoice.id', $invoice->id);
});

test('suggests on the client name found in the label', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Callisto SA']);
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent());

    importCsv($user, csvWithMovements('08/08/2026;VIR SEPA CALLISTO;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.reason', BankMatchReason::ClientInLabel->value);
});

test('prefers the reference over the client name', function (): void {
    $user = User::factory()->create();
    $clientA = Client::factory()->for($user)->create(['name' => 'Vesterhus']);
    $byRef = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));
    invoiceOwnedBy($user, $clientA, fn ($factory) => $factory->sent());

    importCsv($user, csvWithMovements('08/08/2026;VIR VESTERHUS REF 2026041;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.reason', BankMatchReason::RefInLabel->value)
        ->assertJsonPath('account.pendingMatches.0.invoice.id', $byRef->id);
});

test('suggests an overdue invoice when its amount is unique', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());

    importCsv($user, csvWithMovements('08/08/2026;VIR SEPA ANONYME;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.reason', BankMatchReason::OverdueUniqueAmount->value)
        ->assertJsonPath('account.pendingMatches.0.invoice.id', $invoice->id);
});

test('stays silent when two invoices share the amount and nothing identifies one', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());

    importCsv($user, csvWithMovements('08/08/2026;VIR SEPA ANONYME;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 0);
});

test('never suggests a sent invoice that is not overdue on amount alone', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    importCsv($user, csvWithMovements('08/08/2026;VIR SEPA ANONYME;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 0);
});

test('ignores debits and amounts that match nothing exactly', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));

    importCsv($user, csvWithMovements(
        '08/08/2026;PRLV 2026041;-1 980,00',
        '09/08/2026;VIR REF 2026041;1 980,01',
    ))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 0);
});

test('claims each invoice at most once per import', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));

    importCsv($user, csvWithMovements(
        '05/08/2026;VIR REF 2026041;1 980,00',
        '09/08/2026;VIR REF 2026041 BIS;1 980,00',
    ))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.bookedOn', '2026-08-05');
});

test('a re-import matches invoices sent since the first import', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);
    $csv = csvWithMovements('08/08/2026;VIR REF 2026041;1 980,00');

    // First import: the invoice is still a draft, so nothing can match.
    importCsv($user, $csv)->assertCreated()->assertJsonPath('suggestionCount', 0);

    $invoice->update(['status' => InvoiceStatus::Sent, 'number' => '2026-041']);

    importCsv($user, $csv)
        ->assertCreated()
        ->assertJsonPath('importedCount', 0)
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.invoice.id', $invoice->id);
});

test('never resurrects a dismissed pairing on re-import', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));
    $csv = csvWithMovements('08/08/2026;VIR REF 2026041;1 980,00');

    $matchId = importCsv($user, $csv)->assertCreated()->json('account.pendingMatches.0.id');

    $this->actingAs($user)->postJson("/api/bank/matches/{$matchId}/dismiss")->assertOk();

    importCsv($user, $csv)
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 0)
        ->assertJsonPath('account.pendingMatches', []);
});

test('never matches another account\'s invoices', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();
    invoiceOwnedBy($other, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));

    importCsv($user, csvWithMovements('08/08/2026;VIR REF 2026041;1 980,00'))
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 0);
});
