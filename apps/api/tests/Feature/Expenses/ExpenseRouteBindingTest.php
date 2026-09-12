<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

/**
 * There is no policy layer: every {expense} route resolves through the
 * owner-scoped binding, and this sweep is what proves each one does.
 */
test('every expense route answers 404 for another account expense', function (string $method, string $path): void {
    $foreign = expenseOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->json($method, str_replace('{expense}', (string) $foreign->id, $path))
        ->assertNotFound();
})->with([
    'update' => ['PUT', '/api/expenses/{expense}'],
    'delete' => ['DELETE', '/api/expenses/{expense}'],
    'attach receipt' => ['POST', '/api/expenses/{expense}/receipt'],
    'download receipt' => ['GET', '/api/expenses/{expense}/receipt'],
    'detach receipt' => ['DELETE', '/api/expenses/{expense}/receipt'],
    'reintegrate VAT' => ['DELETE', '/api/expenses/{expense}/vat-deferral'],
]);
