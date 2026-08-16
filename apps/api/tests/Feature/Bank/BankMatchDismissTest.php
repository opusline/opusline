<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Factories\BankMatchFactory;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('dismissing a suggestion keeps the row and leaves the invoice alone', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());
    $match = bankMatchFor($user, $invoice);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/dismiss")
        ->assertOk()
        ->assertJsonPath('pendingMatches', []);

    expect($match->refresh()->status)->toBe(BankMatchStatus::Dismissed)
        ->and($invoice->refresh()->status)->toBe(InvoiceStatus::Sent);
});

test('refuses to dismiss a suggestion that was already settled', function (): void {
    $user = User::factory()->create();
    $match = bankMatchFor($user, configure: fn (BankMatchFactory $factory): BankMatchFactory => $factory->validated());

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/dismiss")
        ->assertConflict()
        ->assertJsonPath('message', __('bank.match_already_settled'));
});
