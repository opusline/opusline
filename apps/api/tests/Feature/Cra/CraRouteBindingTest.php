<?php

declare(strict_types=1);

use App\Domain\Cra\Models\Cra;
use App\Domain\Users\Models\User;

test('resolves a CRA belonging to the authenticated user', function (): void {
    $cra = craOwnedBy($user = User::factory()->create());

    $this->actingAs($user);

    expect((new Cra)->resolveRouteBinding($cra->id)?->getKey())->toBe($cra->id);
});

test('does not resolve a CRA belonging to another user', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create());

    expect((new Cra)->resolveRouteBinding($cra->id))->toBeNull();
});

test('does not resolve anything for a guest', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    expect((new Cra)->resolveRouteBinding($cra->id))->toBeNull();
});
