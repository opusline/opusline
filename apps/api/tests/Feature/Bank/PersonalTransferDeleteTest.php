<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\PersonalTransferFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('deletes a recorded transfer and puts its amount back on the table', function (): void {
    $user = accountWithBankBalance();
    $transfer = personalTransferFor($user, fn (PersonalTransferFactory $factory): PersonalTransferFactory => $factory->of(120_000)->on('2026-08-13'));

    $this->actingAs($user)
        ->deleteJson("/api/treasury/transfers/{$transfer->id}")
        ->assertOk()
        ->assertJsonPath('pendingTransfers.amount', 0)
        ->assertJsonPath('transferable.amount', 1_000_000)
        ->assertJsonPath('transfers', []);

    $this->assertDatabaseMissing('personal_transfers', ['id' => $transfer->id]);
});

test('another account transfer is invisible and untouched', function (): void {
    $user = accountWithBankBalance();
    $transfer = personalTransferFor(User::factory()->create());

    $this->actingAs($user)
        ->deleteJson("/api/treasury/transfers/{$transfer->id}")
        ->assertNotFound();

    $this->assertDatabaseHas('personal_transfers', ['id' => $transfer->id]);
});
