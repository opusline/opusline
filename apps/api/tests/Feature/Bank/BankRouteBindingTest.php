<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('another account\'s suggestion is invisible', function (string $action): void {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $foreignMatch = bankMatchFor($other);

    $this->actingAs($user)
        ->postJson("/api/bank/matches/{$foreignMatch->id}/{$action}")
        ->assertNotFound();
})->with(['validate', 'dismiss']);
