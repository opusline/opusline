<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Factories\BankMatchFactory;
use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('validating a suggestion pays the invoice on the movement date and links the movement', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['issued_on' => '2026-08-01']));
    $movement = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(198_000)->on('2026-08-08'));
    $match = bankMatchFor($user, $invoice, $movement);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/validate")
        ->assertOk()
        ->assertJsonPath('pendingMatches', [])
        ->assertJsonPath('movements.0.invoice.id', $invoice->id);

    $invoice->refresh();
    expect($invoice->status)->toBe(InvoiceStatus::Paid)
        ->and($invoice->paid_on?->toDateString())->toBe('2026-08-08')
        ->and($movement->refresh()->invoice_id)->toBe($invoice->id)
        ->and($match->refresh()->status)->toBe(BankMatchStatus::Validated)
        ->and($invoice->events()->where('kind', InvoiceEventKind::Paid)->exists())->toBeTrue();
});

test('refuses a suggestion that was already settled', function (): void {
    $user = User::factory()->create();
    $match = bankMatchFor($user, configure: fn (BankMatchFactory $factory): BankMatchFactory => $factory->dismissed());

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/validate")
        ->assertConflict()
        ->assertJsonPath('message', __('bank.match_already_settled'));
});

test('surfaces the invoice guard when the invoice was paid meanwhile', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid());
    $match = bankMatchFor($user, $invoice);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/validate")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_pay_unless_sent'));

    expect($match->refresh()->status)->toBe(BankMatchStatus::Pending);
});

test('surfaces the invoice guard when the movement predates the issue date', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['issued_on' => '2026-08-10']));
    $movement = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(198_000)->on('2026-08-05'));
    $match = bankMatchFor($user, $invoice, $movement);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/validate")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.paid_on_before_issued'));
});

test('refuses a movement dated in the future', function (): void {
    $user = User::factory()->create();
    $movement = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(198_000)->on('2026-08-20'));
    $match = bankMatchFor($user, movement: $movement);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$match->id}/validate")
        ->assertConflict()
        ->assertJsonPath('message', __('bank.movement_in_future'));
});
