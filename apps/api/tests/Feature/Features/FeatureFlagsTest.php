<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

// phpunit.xml switches every flag on; the invoicing walk-through below reads
// the account's features with that flag alone in play.
beforeEach(fn () => bankAccountsReleasedAs('off'));

test('keeps a beta feature off until the account opts in', function (): void {
    invoicingReleasedAs('beta');
    $user = User::factory()->create();

    $this->actingAs($user)->getJson('/api/user')->assertJsonPath('features', []);
    $this->getJson('/api/invoicing/catalog')->assertNotFound();

    $this->putJson('/api/user/features/invoicing', ['active' => true])
        ->assertOk()
        ->assertJsonPath('features.0.key', 'invoicing')
        ->assertJsonPath('features.0.active', true);

    $this->getJson('/api/user')->assertJsonPath('features', [0]);
    $this->getJson('/api/invoicing/catalog')->assertOk();
});

test('lets the account leave the beta', function (): void {
    invoicingReleasedAs('beta');
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/user/features/invoicing', ['active' => true])->assertOk();
    $this->putJson('/api/user/features/invoicing', ['active' => false])
        ->assertOk()
        ->assertJsonPath('features.0.active', false);

    $this->getJson('/api/invoicing/catalog')->assertNotFound();
});

test('keeps one account\'s choice its own', function (): void {
    invoicingReleasedAs('beta');
    $this->actingAs(User::factory()->create())
        ->putJson('/api/user/features/invoicing', ['active' => true])
        ->assertOk();

    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoicing/catalog')
        ->assertNotFound();
});

test('lets the instance force a feature on or off, whatever the account chose', function (): void {
    invoicingReleasedAs('beta');
    $user = User::factory()->create();
    $this->actingAs($user)->putJson('/api/user/features/invoicing', ['active' => true])->assertOk();

    invoicingReleasedAs('off');
    $this->getJson('/api/invoicing/catalog')->assertNotFound();
    $this->getJson('/api/user')->assertJsonPath('features', []);

    invoicingReleasedAs('on');
    $this->actingAs(User::factory()->create())->getJson('/api/invoicing/catalog')->assertOk();
});

test('hides a mistyped release rather than shipping the feature', function (): void {
    invoicingReleasedAs('yes');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoicing/catalog')
        ->assertNotFound();
});

test('refuses to switch a feature the instance does not offer in beta', function (string $release): void {
    invoicingReleasedAs($release);

    $this->actingAs(User::factory()->create())
        ->putJson('/api/user/features/invoicing', ['active' => true])
        ->assertConflict();
})->with(['on', 'off']);

test('lists only the features offered in beta', function (): void {
    $user = User::factory()->create();

    invoicingReleasedAs('on');
    $this->actingAs($user)->getJson('/api/user/features')->assertExactJson(['features' => []]);

    invoicingReleasedAs('beta');
    $this->getJson('/api/user/features')
        ->assertExactJson(['features' => [['feature' => 0, 'key' => 'invoicing', 'active' => false]]]);

    bankAccountsReleasedAs('beta');
    $this->getJson('/api/user/features')
        ->assertExactJson(['features' => [
            ['feature' => 0, 'key' => 'invoicing', 'active' => false],
            ['feature' => 1, 'key' => 'bank_accounts', 'active' => false],
        ]]);
});

test('lets the account join the several-bank-accounts beta', function (): void {
    invoicingReleasedAs('on');
    bankAccountsReleasedAs('beta');
    $user = User::factory()->create();
    $account = typedBankBalanceFor($user, 250_000, '2026-08-11');

    $this->actingAs($user)->putJson("/api/bank/accounts/{$account->id}", ['name' => 'Shine', 'archived' => false])->assertNotFound();

    $this->putJson('/api/user/features/bank_accounts', ['active' => true])->assertOk();

    $this->getJson('/api/user')->assertJsonPath('features', [0, 1]);
    $this->putJson("/api/bank/accounts/{$account->id}", ['name' => 'Shine', 'archived' => false])->assertOk();
});

test('answers 404 for a feature that does not exist', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/user/features/teleportation', ['active' => true])
        ->assertNotFound();
});

test('validates the choice', function (): void {
    invoicingReleasedAs('beta');

    $this->actingAs(User::factory()->create())
        ->putJson('/api/user/features/invoicing', ['active' => 'maybe'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('active');
});

test('keeps the features to signed-in accounts', function (): void {
    $this->getJson('/api/user/features')->assertUnauthorized();
    $this->putJson('/api/user/features/invoicing', ['active' => true])->assertUnauthorized();
});

test('hides every invoicing endpoint while the feature is off', function (string $method, string $uri): void {
    invoicingReleasedAs('off');

    $this->actingAs(User::factory()->create())
        ->json($method, $uri)
        ->assertNotFound();
})->with([
    ['GET', '/api/invoicing/settings'],
    ['PUT', '/api/invoicing/settings'],
    ['POST', '/api/invoicing/invoices'],
    ['PUT', '/api/invoicing/invoices/1'],
    ['GET', '/api/invoicing/unbilled-time?missionId=1'],
    ['POST', '/api/invoicing/invoices/paper'],
    ['GET', '/api/invoices/1/paper'],
    ['GET', '/api/invoices/1/pdf'],
    ['POST', '/api/invoicing/invoices/1/issue'],
    ['GET', '/api/invoicing/catalog'],
    ['POST', '/api/invoicing/catalog'],
    ['PUT', '/api/invoicing/catalog/1'],
    ['DELETE', '/api/invoicing/catalog/1'],
]);

test('hides the bank account endpoint while several bank accounts are off', function (): void {
    $user = User::factory()->create();
    $account = typedBankBalanceFor($user, 250_000, '2026-08-11');

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$account->id}", ['name' => 'Shine', 'archived' => false])
        ->assertNotFound();

    expect($account->refresh()->name)->toBeNull();
});

test('keeps the invoices recorded from another tool reachable while it is off', function (): void {
    invoicingReleasedAs('off');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/invoices')
        ->assertOk();
});
