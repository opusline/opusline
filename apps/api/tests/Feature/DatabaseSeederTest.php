<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('seeds a demo portfolio for the test user', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect($user->clients)->toHaveCount(5)
        ->and($user->missions)->toHaveCount(4)
        ->and($user->clients->every(fn ($client): bool => $client->slug !== ''))->toBeTrue();
});
