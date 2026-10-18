<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\IssueInvoice;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpKernel\Exception\HttpException;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

test('numbers, dates and freezes the invoice it validates', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertOk()
        ->assertJsonPath('invoice.number', '2026-001')
        ->assertJsonPath('invoice.status', InvoiceStatus::Sent->value)
        // Dated the day it is issued, so the number and the date stay in order.
        ->assertJsonPath('invoice.issuedOn', '2026-08-10')
        ->assertJsonPath('invoice.dueOn', '2026-09-09')
        ->assertJsonPath('content.seller.name', 'Théo Marchand')
        ->assertJsonPath('content.seller.legalMention', 'EI')
        ->assertJsonPath('content.seller.siren', '123456782')
        ->assertJsonPath('content.seller.iban', 'FR7630006000011234567890189')
        ->assertJsonPath('content.seller.email', 'theo@marchand.dev')
        ->assertJsonPath('content.buyer.name', 'Nordlys')
        ->assertJsonPath('content.buyer.siren', '123456782')
        ->assertJsonPath('content.buyer.addressLines', ['3 impasse des Potiers', '44100 Nantes']);
});

test('continues the series from the last number, Opusline\'s or another tool\'s', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    Invoice::factory()->for($user)->for($client)->create(['number' => '2026-041', 'status' => InvoiceStatus::Sent]);
    $id = draftFor($user, $client);

    $this->actingAs($user)->getJson('/api/invoicing/settings')->assertJsonPath('nextInvoiceNumber', '2026-042');

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertJsonPath('invoice.number', '2026-042');
});

test('leaves no gap behind a deleted draft', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $deleted = draftFor($user, $client);
    $this->actingAs($user)->deleteJson("/api/invoices/{$deleted}")->assertNoContent();
    $id = draftFor($user, $client);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertJsonPath('invoice.number', '2026-001');
});

test('keeps the parties as they stood when the invoice was issued', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = draftFor($user, $client);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue");

    $user->settingsOrFail()->update(['company_city' => 'Lyon']);
    $client->update(['name' => 'Nordlys SAS']);

    $this->actingAs($user)
        ->getJson("/api/invoices/{$id}")
        ->assertJsonPath('content.seller.addressLines.1', '44000 Nantes')
        ->assertJsonPath('content.buyer.name', 'Nordlys');
});

test('hides the IBAN and e-mail the invoice did not ask to show', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user), ['showIban' => false, 'showEmail' => false]);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertJsonPath('content.seller.iban', null)
        ->assertJsonPath('content.seller.email', null);
});

test('refuses to issue an invoice missing a mandatory mention', function (callable $arrange, string $field): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = draftFor($user, $client);
    $arrange($user, $client, $id);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertJsonValidationErrorFor($field);

    expect(Invoice::query()->findOrFail($id)->number)->toBeNull();
})->with([
    'no siret' => [fn (User $user) => $user->settingsOrFail()->update(['siret' => null]), 'seller'],
    'no vat number while liable' => [fn (User $user) => $user->settingsOrFail()->update(['vat_number' => null]), 'seller'],
    'no seller address' => [fn (User $user) => $user->settingsOrFail()->update(['company_address_line1' => null]), 'seller'],
    'no client address' => [fn (User $user, Client $client) => $client->update(['billing_address_line1' => null]), 'buyer'],
    'iban shown but missing' => [fn (User $user) => $user->settingsOrFail()->update(['iban' => null]), 'showIban'],
    'no lines' => [function (User $user, Client $client, int $id): void {
        Invoice::query()->findOrFail($id)->lines()->delete();
    }, 'lines'],
    'a total of zero' => [fn (User $user, Client $client, int $id) => test()->actingAs($user)->putJson("/api/invoicing/invoices/{$id}", draftPayloadFor($client, ['lines' => [
        ['label' => 'Atelier', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 50_000, 'currency' => 'EUR'], 'vatRateBp' => 2000],
        ['label' => 'Remise', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => -50_000, 'currency' => 'EUR'], 'vatRateBp' => 2000],
    ]]))->assertOk(), 'lines'],
]);

test('freezes an issued invoice against every edit', function (string $method, string $path, array $body): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = draftFor($user, $client);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue");

    $this->actingAs($user)
        ->json($method, str_replace('{id}', (string) $id, $path), $body)
        ->assertConflict();
})->with([
    'issue again' => ['POST', '/api/invoicing/invoices/{id}/issue', []],
    'edit the draft' => ['PUT', '/api/invoicing/invoices/{id}', [
        'clientId' => 0, 'paymentTermsDays' => 30, 'paymentTermsEndOfMonth' => false, 'showIban' => false,
        'showEmail' => false, 'language' => 0, 'lines' => [],
    ]],
    'delete' => ['DELETE', '/api/invoices/{id}', []],
    'detach the document' => ['DELETE', '/api/invoices/{id}/document', []],
    'correct the dates' => ['PATCH', '/api/invoices/{id}/dates', ['issuedOn' => '2026-08-09']],
]);

test('refuses another PDF in place of the one Opusline issues', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue");

    $this->actingAs($user)
        ->post("/api/invoices/{$id}/document", ['file' => UploadedFile::fake()->create('facture.pdf', 10, 'application/pdf')])
        ->assertConflict();
});

test('sends a draft back to the editor when the VAT regime changed since it was saved', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase]);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertJsonValidationErrorFor('lines');

    expect(Invoice::query()->findOrFail($id)->number)->toBeNull();
});

test('numbers a draft once, however stale the copy a racing request holds', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));
    $stale = Invoice::query()->findOrFail($id);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    expect(fn () => app(IssueInvoice::class)->handle($user, $stale))->toThrow(HttpException::class);

    $issued = Invoice::query()->findOrFail($id);
    expect($issued->number)->toBe('2026-001')
        ->and($issued->events()->count())->toBe(2);
});

test('keeps another account\'s draft from being issued', function (): void {
    $owner = issuableAccount();
    $id = draftFor($owner, billableClient($owner));

    $this->actingAs(issuableAccount())
        ->postJson("/api/invoicing/invoices/{$id}/issue")
        ->assertNotFound();

    $draft = Invoice::query()->findOrFail($id);
    expect($draft->number)->toBeNull()
        ->and($draft->status)->toBe(InvoiceStatus::Draft)
        ->and($draft->seller_snapshot)->toBeNull()
        ->and($draft->events()->count())->toBe(1);
});
