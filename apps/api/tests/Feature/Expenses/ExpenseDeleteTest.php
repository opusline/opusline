<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('deletes an expense', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
});

test('another account expense is invisible and untouched', function (): void {
    $expense = expenseOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/expenses/{$expense->id}")
        ->assertNotFound();

    $this->assertDatabaseHas('expenses', ['id' => $expense->id]);
});
