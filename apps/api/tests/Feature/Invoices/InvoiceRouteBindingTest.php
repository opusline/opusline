<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

/**
 * There is no policy layer: ownership is enforced by the route binding, so every
 * route that resolves an {invoice} has to be covered.
 */
test('another user invoice is invisible on every route', function (string $method, string $suffix, array $payload): void {
    $user = User::factory()->create();
    $foreignInvoice = invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->json($method, "/api/invoices/{$foreignInvoice->id}{$suffix}", $payload)
        ->assertNotFound();
})->with([
    'show' => ['GET', '', []],
    'update' => ['PUT', '', ['clientId' => 1, 'amountHt' => ['amount' => 1000, 'currency' => 'EUR']]],
    'delete' => ['DELETE', '', []],
    'send' => ['POST', '/send', []],
    'pay' => ['POST', '/pay', ['paidOn' => '2026-08-01']],
    'remind' => ['POST', '/reminders', []],
]);

test('the invoice list never leaks another user rows', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);
    invoiceOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(1, 'invoices');
});
