<?php

declare(strict_types=1);

use App\Domain\Users\Data\UserData;
use App\Domain\Users\Models\User;

test('user data maps from the user model', function (): void {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $data = UserData::from($user);

    expect($data->id)->toBe($user->id)
        ->and($data->name)->toBe('Test User')
        ->and($data->email)->toBe('test@example.com');
});
