<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('syncs every active connection, unattended', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => Http::response(['transactions' => [ebTransaction()]]),
    ]);
    $first = User::factory()->create();
    $second = User::factory()->create();
    connectedBankFor($first);
    connectedBankFor($second);

    $this->artisan('bank:sync')->assertSuccessful();

    expect($first->bankMovements()->count())->toBe(1)
        ->and($second->bankMovements()->count())->toBe(1);
    // No holder at the keyboard: the bank must count it as a background read.
    Http::assertNotSent(fn (Request $request): bool => $request->hasHeader('Psu-Ip-Address'));
});

test('leaves alone the connections that cannot sync', function (callable $configure): void {
    Http::fake();
    connectedBankFor(User::factory()->create(), $configure);

    $this->artisan('bank:sync')->assertSuccessful();

    Http::assertNothingSent();
})->with([
    'awaiting an account' => [fn ($factory) => $factory->state(['status' => BankConnectionStatus::AwaitingAccount, 'account_uid' => null])],
    'expired' => [fn ($factory) => $factory->state(['status' => BankConnectionStatus::Expired])],
    'past its consent' => [fn ($factory) => $factory->state(['valid_until' => CarbonImmutable::now()->subHour()])],
]);

test('one bank refusing does not stop the others', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => Http::sequence()
            ->push(['message' => 'Limit', 'error' => 'ASPSP_RATE_LIMIT_EXCEEDED'], 429)
            ->push(['transactions' => [ebTransaction()]]),
    ]);
    $refused = User::factory()->create();
    $synced = User::factory()->create();
    $refusedConnection = connectedBankFor($refused);
    connectedBankFor($synced);

    $this->artisan('bank:sync')->assertSuccessful();

    expect($refusedConnection->refresh()->last_error)->toBe(BankSyncError::RateLimited)
        ->and($synced->bankMovements()->count())->toBe(1);
});

test('is scheduled, so the scheduler container runs it', function (): void {
    $this->artisan('schedule:list')
        ->expectsOutputToContain('bank:sync')
        ->assertSuccessful();
});
