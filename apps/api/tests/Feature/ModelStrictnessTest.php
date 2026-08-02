<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\MissingAttributeException;

test('strict models throw when accessing a missing attribute', function (): void {
    $user = User::factory()->create()->fresh();

    expect(fn () => $user->attribute_that_does_not_exist)
        ->toThrow(MissingAttributeException::class);
});
