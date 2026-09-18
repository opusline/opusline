<?php

declare(strict_types=1);

use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\EnableBanking\EnableBankingJwt;
use App\Domain\Bank\Enums\BankSyncError;
use Carbon\CarbonImmutable;

test('names the application in the header of an rs256 token', function (): void {
    $token = EnableBankingJwt::sign(new EnableBankingCredentials('app-id', enableBankingPrivateKey()), CarbonImmutable::now());

    expect(decodeJwt($token)[0])->toBe(['typ' => 'JWT', 'alg' => 'RS256', 'kid' => 'app-id']);
});

test('addresses the token to enable banking for an hour', function (): void {
    $issuedAt = CarbonImmutable::parse('2026-08-13 12:00:00', 'UTC');

    $token = EnableBankingJwt::sign(new EnableBankingCredentials('app-id', enableBankingPrivateKey()), $issuedAt);

    expect(decodeJwt($token)[1])->toBe([
        'iss' => 'enablebanking.com',
        'aud' => 'api.enablebanking.com',
        'iat' => $issuedAt->getTimestamp(),
        'exp' => $issuedAt->getTimestamp() + 3600,
    ]);
});

test('signs the token with the application key', function (): void {
    $privateKey = enableBankingPrivateKey();
    $publicKey = openssl_pkey_get_details(openssl_pkey_get_private($privateKey))['key'];

    [, , $signingInput, $signature] = decodeJwt(
        EnableBankingJwt::sign(new EnableBankingCredentials('app-id', $privateKey), CarbonImmutable::now()),
    );

    expect(openssl_verify($signingInput, $signature, $publicKey, OPENSSL_ALGO_SHA256))->toBe(1);
});

test('refuses to sign with a key that is not one', function (): void {
    expect(fn (): string => EnableBankingJwt::sign(new EnableBankingCredentials('app-id', 'not a key'), CarbonImmutable::now()))
        ->toThrow(function (BankSyncFailed $failure): void {
            expect($failure->reason)->toBe(BankSyncError::CredentialsRejected);
        });
});
