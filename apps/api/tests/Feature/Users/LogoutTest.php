<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('an authenticated user can log out', function (): void {
    $this->actingAs(User::factory()->create());

    fromSpa()->postJson('/api/logout')->assertNoContent();

    $this->assertGuest('web');
});

test('guests cannot log out', function (): void {
    $this->postJson('/api/logout')->assertUnauthorized();
});
