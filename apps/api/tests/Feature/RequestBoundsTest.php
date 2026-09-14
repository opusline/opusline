<?php

declare(strict_types=1);

use App\Domain\Expenses\Data\ExpenseSelectionData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Passkeys\Webauthn\CredentialJson;
use App\Domain\Users\Models\User;
use Illuminate\Testing\TestResponse;

/**
 * The boundary is where an oversized body has to stop, because past it the
 * failure is a 500 rather than a refusal: the ids reach `whereIn` unsplit,
 * where Postgres' 65 535 bind parameters are a driver exception, and the
 * credential is decoded twice — on two routes that answer without a session.
 *
 * Each case reads the ceiling back out of the message, because both endpoints
 * have another rule that would refuse an oversized body for its own reasons
 * and would make the assertion pass with no bound at all.
 */
test('a selection past the ceiling is refused instead of reaching whereIn', function (string $route): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson($route, [
            'expenseIds' => range(1, ExpenseSelectionData::MAX_SELECTION + 1),
            'category' => ExpenseCategory::Software->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');

    expect($response->json('errors.expenseIds.0'))->toContain((string) ExpenseSelectionData::MAX_SELECTION);
})->with([
    'recategorize' => ['/api/expenses/category'],
    'defer the TVA' => ['/api/expenses/vat-deferrals'],
]);

test('a credential past the ceiling is refused before anything decodes it', function (callable $post, string $field): void {
    // Well-formed JSON, so its length is the only rule left to fail.
    $oversized = json_encode(['id' => str_repeat('a', CredentialJson::MAX_LENGTH)], JSON_THROW_ON_ERROR);

    $response = $post($oversized)->assertUnprocessable()->assertJsonValidationErrors($field);

    expect($response->json("errors.{$field}.0"))->toContain((string) CredentialJson::MAX_LENGTH);
})->with([
    'passwordless sign-in' => [
        fn (string $credential): TestResponse => test()->postJson('/api/passkeys/login', ['credential' => $credential]),
        'credential',
    ],
    'the second factor' => [
        fn (string $credential): TestResponse => test()->postJson('/api/two-factor-challenge', ['passkey' => $credential]),
        'passkey',
    ],
    'enrolment' => [
        fn (string $credential): TestResponse => withConfirmedPassword(User::factory()->create())
            ->postJson('/api/user/passkeys', ['name' => 'Clé Vesterhus', 'credential' => $credential]),
        'credential',
    ],
]);
