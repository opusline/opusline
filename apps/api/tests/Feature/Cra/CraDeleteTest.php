<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('puts a draft month back on the pile', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->deleteJson("/api/cras/{$cra->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('cras', ['id' => $cra->id]);
    $this->assertDatabaseCount('cra_days', 0);
});

test('refuses to delete a CRA the client already holds', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->deleteJson("/api/cras/{$cra->id}")
        ->assertStatus(409);

    $this->assertDatabaseHas('cras', ['id' => $cra->id]);
});

test('cannot delete another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->deleteJson("/api/cras/{$cra->id}")
        ->assertNotFound();

    $this->assertDatabaseHas('cras', ['id' => $cra->id]);
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->deleteJson("/api/cras/{$cra->id}")->assertUnauthorized();
});
