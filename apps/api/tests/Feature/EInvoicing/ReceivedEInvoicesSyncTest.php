<?php

declare(strict_types=1);

use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Enums\LifecycleStatus;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    Storage::fake('local');
});

/**
 * @param  list<string>  $codes
 * @return array<string, mixed>
 */
function receivedInvoice(int $id, array $codes = ['fr:202'], array $overrides = []): array
{
    return array_replace_recursive([
        'id' => $id,
        'direction' => 'in',
        'created_at' => '2026-08-12T09:00:00Z',
        'events' => array_map(static fn (string $code): array => ['status_code' => $code, 'created_at' => '2026-08-12T09:00:00Z'], $codes),
        'en_invoice' => [
            'number' => 'LUN-2026-0'.$id,
            'issue_date' => '2026-08-01',
            'payment_due_date' => '2026-08-31',
            'currency_code' => 'EUR',
            'seller' => ['name' => 'Lunaprint', 'legal_registration_identifier' => ['scheme' => '0002', 'value' => '851234567']],
            'totals' => ['total_without_vat' => '120.00', 'total_vat_amount' => '24.00', 'total_with_vat' => '144.00'],
        ],
    ], $overrides);
}

/**
 * The inbox as successive syncs see it: one run per sync, each a list of
 * invoices. Laravel keeps the first fake that matches a URL, so a test that
 * syncs twice declares both runs up front.
 *
 * @param  list<list<array<string, mixed>>>  $runs
 * @param  array<string, mixed>  $overrides
 */
function fakeInboxRuns(array $runs, array $overrides = []): void
{
    $list = Http::sequence();
    $details = [];

    foreach ($runs as $invoices) {
        $list->push(['data' => array_map(static fn (array $invoice): array => ['id' => $invoice['id']], $invoices), 'has_more' => false]);

        foreach ($invoices as $invoice) {
            $details[$invoice['id']] ??= Http::sequence();
            $details[$invoice['id']]->push($invoice);
        }
    }

    $routes = ['api.superpdp.tech/v1.beta/invoices?*' => $list];

    foreach ($details as $id => $sequence) {
        $routes["api.superpdp.tech/v1.beta/invoices/{$id}?format=en16931"] = $sequence;
        $routes["api.superpdp.tech/v1.beta/invoices/{$id}?format=original"] = Http::response('%PDF-1.7 facture '.$id, 200, ['Content-Type' => 'application/pdf']);
    }

    fakeSuperPdp([...$routes, ...$overrides]);
}

/**
 * @param  list<array<string, mixed>>  $invoices
 * @param  array<string, mixed>  $overrides
 */
function fakeInbox(array $invoices, array $overrides = []): void
{
    fakeInboxRuns([$invoices], $overrides);
}

test('records each received invoice as an expense with its pdf as receipt', function (): void {
    fakeInbox([receivedInvoice(7), receivedInvoice(8, ['fr:202', 'fr:204'], ['en_invoice' => ['number' => 'LUN/2026/08', 'totals' => ['total_without_vat' => '50.00', 'total_with_vat' => '50.00']]])]);
    $user = User::factory()->create();
    withSuperPdpConnection($user);

    test()->actingAs($user)
        ->postJson('/api/expenses/e-invoices/sync')
        ->assertOk()
        ->assertJson(['fetched' => 2, 'imported' => 2, 'updated' => 0, 'skipped' => 0]);

    $expenses = $user->expenses()->orderBy('e_invoice_platform_id')->get();
    expect($expenses)->toHaveCount(2)
        ->and($expenses[0]->supplier)->toBe('Lunaprint')
        ->and($expenses[0]->description)->toBe('N° LUN-2026-07')
        ->and($expenses[0]->spent_on->toDateString())->toBe('2026-08-01')
        ->and($expenses[0]->category)->toBe(ExpenseCategory::Other)
        ->and($expenses[0]->vat_treatment)->toBe(ExpenseVatTreatment::Domestic)
        ->and($expenses[0]->vat_rate_bp)->toBe(2000)
        ->and((int) $expenses[0]->amount_ht_cents->getAmount())->toBe(12_000)
        ->and((int) $expenses[0]->amount_ttc_cents->getAmount())->toBe(14_400)
        ->and($expenses[0]->e_invoice_status)->toBe(LifecycleStatus::Received)
        ->and($expenses[0]->receipt()?->file_name)->toBe('Facture-LUN-2026-07.pdf')
        ->and($expenses[1]->vat_rate_bp)->toBe(0)
        ->and($expenses[1]->e_invoice_status)->toBe(LifecycleStatus::TakenInCharge)
        ->and($expenses[1]->receipt()?->file_name)->toBe('Facture-LUN-2026-08.pdf');

    expect($user->eInvoicingConnection()->sole()->last_synced_at)->not->toBeNull();
    test()->actingAs($user)->getJson('/api/expenses?month=2026-08')
        ->assertJsonPath('expenses.0.eInvoice.platformId', '8')
        ->assertJsonPath('expenses.0.eInvoice.status', LifecycleStatus::TakenInCharge->value)
        ->assertJsonPath('expenses.0.receipt.fileName', 'Facture-LUN-2026-08.pdf');
});

test('never records the same received invoice twice, but follows its status', function (): void {
    fakeInboxRuns([[receivedInvoice(7)], [receivedInvoice(7, ['fr:202', 'fr:210'])]]);
    $user = User::factory()->create();
    withSuperPdpConnection($user);
    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertOk();

    test()->actingAs($user)
        ->postJson('/api/expenses/e-invoices/sync')
        ->assertOk()
        ->assertJson(['fetched' => 1, 'imported' => 0, 'updated' => 1]);

    expect($user->expenses()->count())->toBe(1)
        ->and($user->expenses()->sole()->e_invoice_status)->toBe(LifecycleStatus::Refused);
    expect(Http::recorded(fn (Request $request): bool => str_contains($request->url(), 'format=original')))->toHaveCount(1);
});

test('keeps a received invoice out of the journal once its expense was deleted', function (): void {
    fakeInboxRuns([[receivedInvoice(7)], [receivedInvoice(7)]]);
    $user = User::factory()->create();
    withSuperPdpConnection($user);
    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertOk();
    $expense = $user->expenses()->sole();
    test()->actingAs($user)->deleteJson("/api/expenses/{$expense->id}")->assertNoContent();

    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertOk()->assertJson(['imported' => 0]);

    expect($user->expenses()->count())->toBe(0);
});

test('dates a post-dated invoice today and leaves another currency aside', function (): void {
    fakeInbox([
        receivedInvoice(7, ['fr:202'], ['en_invoice' => ['issue_date' => '2026-12-24']]),
        receivedInvoice(8, ['fr:202'], ['en_invoice' => ['currency_code' => 'USD']]),
    ]);
    $user = User::factory()->create();
    withSuperPdpConnection($user);

    test()->actingAs($user)
        ->postJson('/api/expenses/e-invoices/sync')
        ->assertOk()
        ->assertJson(['fetched' => 2, 'imported' => 1, 'skipped' => 1]);

    expect($user->expenses()->sole()->spent_on->toDateString())->toBe(CarbonImmutable::today()->toDateString());
});

test('reads the whole inbox the first time, then only what moved since the last sync', function (): void {
    $stale = receivedInvoice(9, ['fr:202'], ['created_at' => '2026-07-01T09:00:00Z']);
    $stale['events'] = [['status_code' => 'fr:202', 'created_at' => '2026-07-01T09:00:00Z']];
    fakeInboxRuns([[receivedInvoice(7)], [receivedInvoice(7), $stale]]);
    $user = User::factory()->create();
    $connection = withSuperPdpConnection($user);
    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertOk();
    $connection->refresh()->forceFill(['last_synced_at' => CarbonImmutable::parse('2026-08-12 05:30')])->save();

    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertOk()->assertJson(['fetched' => 1, 'imported' => 0]);

    expect($user->expenses()->count())->toBe(1);
});

test('says why when the platform refuses, on the connection too', function (): void {
    fakeSuperPdp(['api.superpdp.tech/oauth2/token' => Http::response(['error' => 'invalid_client'], 401)]);
    $user = User::factory()->create();
    $connection = withSuperPdpConnection($user);

    test()->actingAs($user)
        ->postJson('/api/expenses/e-invoices/sync')
        ->assertConflict()
        ->assertJsonPath('message', __('einvoicing.credentials_rejected'));

    expect($connection->refresh()->last_error)->toBe(EInvoicingError::CredentialsRejected)
        ->and($connection->last_failed_at)->not->toBeNull();
    test()->actingAs($user)->getJson('/api/settings/integrations')
        ->assertJsonPath('eInvoicing.lastError', EInvoicingError::CredentialsRejected->value);
});

test('waits for the platform to verify the company', function (): void {
    Http::fake();
    $user = User::factory()->create();
    withSuperPdpConnection($user, ['company_verified' => false]);

    test()->actingAs($user)
        ->postJson('/api/expenses/e-invoices/sync')
        ->assertConflict()
        ->assertJsonPath('message', __('einvoicing.company_unverified'));

    Http::assertNothingSent();
});

test('needs a connected platform, the invoicing beta and a signed-in account', function (): void {
    Http::fake();
    $user = User::factory()->create();
    test()->postJson('/api/expenses/e-invoices/sync')->assertUnauthorized();

    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertConflict()->assertJsonPath('message', __('einvoicing.not_connected'));

    invoicingReleasedAs('off');
    withSuperPdpConnection($user);
    test()->actingAs($user)->postJson('/api/expenses/e-invoices/sync')->assertNotFound();
});

test('keeps each account\'s inbox to itself', function (): void {
    fakeInbox([receivedInvoice(7)]);
    $owner = User::factory()->create();
    withSuperPdpConnection($owner);
    $other = User::factory()->create();
    withSuperPdpConnection($other, ['client_id' => 'opusline_other_app']);

    test()->actingAs($other)->postJson('/api/expenses/e-invoices/sync')->assertOk();

    expect($owner->expenses()->count())->toBe(0)->and($other->expenses()->count())->toBe(1);
});

test('the nightly run reads every verified inbox and one failure stops no one else', function (): void {
    $refused = User::factory()->create();
    $synced = User::factory()->create();
    $waiting = User::factory()->create();
    $refusedConnection = withSuperPdpConnection($refused, ['client_id' => 'opusline_refused_app']);
    withSuperPdpConnection($synced);
    withSuperPdpConnection($waiting, ['client_id' => 'opusline_waiting_app', 'company_verified' => false]);
    fakeInbox([receivedInvoice(7)], ['api.superpdp.tech/oauth2/token' => Http::sequence()
        ->push(['error' => 'invalid_client'], 401)
        ->push(['access_token' => 'tok_sandbox', 'expires_in' => 1800])]);

    test()->artisan('einvoicing:sync')->assertSuccessful();

    expect($refusedConnection->refresh()->last_error)->toBe(EInvoicingError::CredentialsRejected)
        ->and($synced->expenses()->count())->toBe(1)
        ->and($waiting->expenses()->count())->toBe(0);
});
