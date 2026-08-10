<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('seeds a demo portfolio for the test user', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect($user->clients)->toHaveCount(5)
        ->and($user->missions)->toHaveCount(4)
        ->and($user->timeEntries)->toHaveCount(17)
        ->and($user->clients->every(fn ($client): bool => $client->slug !== ''))->toBeTrue();
});

test('seeds time on a non-billable mission so the week grid shows one', function (): void {
    $this->seed();

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();
    $nonBillable = $user->missions()
        ->whereNull('rate_cents')
        ->with('timeEntries')
        ->firstOrFail();

    expect($nonBillable->timeEntries)->not->toBeEmpty()
        ->and($nonBillable->timeEntries->every(
            fn ($entry): bool => $entry->note !== null,
        ))->toBeTrue()
        ->and($nonBillable->timeEntries->every(
            fn ($entry): bool => $entry->billable === false,
        ))->toBeTrue();
});
