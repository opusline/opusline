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

test('deleting a subscription debit leaves a tombstone', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);
    $debit = expenseOwnedBy($user, fn ($factory) => $factory->state(['subscription_id' => $subscription->id, 'subscription_period_key' => '2026-08']));

    $this->actingAs($user)->deleteJson("/api/expenses/{$debit->id}")->assertNoContent();

    $this->assertSoftDeleted('expenses', ['id' => $debit->id]);
    $this->actingAs($user)->deleteJson("/api/expenses/{$debit->id}")->assertNotFound();
});

test('another account expense is invisible and untouched', function (): void {
    $expense = expenseOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/expenses/{$expense->id}")
        ->assertNotFound();

    $this->assertDatabaseHas('expenses', ['id' => $expense->id]);
});
