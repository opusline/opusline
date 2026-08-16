<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('another account\'s suggestion is invisible and untouched', function (string $action): void {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $foreignMatch = bankMatchFor($other);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$foreignMatch->id}/{$action}")
        ->assertNotFound();

    $foreignMatch->refresh();
    expect($foreignMatch->status)->toBe(BankMatchStatus::Pending)
        ->and($foreignMatch->movement->invoice_id)->toBeNull()
        ->and($foreignMatch->invoice->status)->toBe(InvoiceStatus::Sent);
})->with(['validate', 'dismiss']);
