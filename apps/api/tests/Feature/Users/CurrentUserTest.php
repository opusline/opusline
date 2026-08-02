<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('the current user endpoint returns the authenticated user', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertExactJson([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
});

test('guests receive a 401 json response', function (): void {
    $this->getJson('/api/user')->assertUnauthorized();
});
