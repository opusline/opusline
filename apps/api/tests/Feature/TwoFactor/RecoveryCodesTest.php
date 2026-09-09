<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('the recovery codes can be read once the password is confirmed', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    withConfirmedPassword($user)
        ->getJson('/api/user/two-factor/recovery-codes')
        ->assertOk()
        ->assertExactJson(['codes' => $user->refresh()->two_factor_recovery_codes]);
});

test('regenerating replaces every recovery code', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    $before = $user->refresh()->two_factor_recovery_codes;

    $after = withConfirmedPassword($user)
        ->postJson('/api/user/two-factor/recovery-codes')
        ->assertOk()
        ->json('codes');

    expect($after)->toHaveCount(8)
        ->and(array_intersect($after, $before ?? []))->toBe([])
        ->and($user->refresh()->two_factor_recovery_codes)->toBe($after);
});

test('reading and regenerating are refused while two-factor is off', function (string $method): void {
    $user = User::factory()->create();

    withConfirmedPassword($user)
        ->json($method, '/api/user/two-factor/recovery-codes')
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.not_enabled'));
})->with(['GET', 'POST']);
