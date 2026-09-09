<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Totp\TotpSecret;
use App\Domain\TwoFactor\Totp\TotpVerifier;
use Carbon\CarbonImmutable;

const TOTP_TEST_SECRET = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';

beforeEach(function (): void {
    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-09-08 12:00:15', 'UTC'));
});

afterEach(function (): void {
    CarbonImmutable::setTestNow();
});

function currentTotpStep(): int
{
    return intdiv(CarbonImmutable::now()->getTimestamp(), TotpSecret::totp(TOTP_TEST_SECRET)->getPeriod());
}

function totpCodeDriftedBy(int $seconds): string
{
    return totpCodeFor(TOTP_TEST_SECRET, CarbonImmutable::now()->getTimestamp() + $seconds);
}

test('the current code matches its own step', function (): void {
    expect(new TotpVerifier()->verify(TOTP_TEST_SECRET, totpCodeDriftedBy(0), null))->toBe(currentTotpStep());
});

test('one step of drift is tolerated on each side, two are not', function (int $driftSeconds, bool $accepted): void {
    $step = new TotpVerifier()->verify(TOTP_TEST_SECRET, totpCodeDriftedBy($driftSeconds), null);

    expect($step !== null)->toBe($accepted);
})->with([
    'previous step' => [-30, true],
    'next step' => [30, true],
    'two steps back' => [-60, false],
    'two steps ahead' => [60, false],
]);

test('a step at or before the last accepted one is refused', function (): void {
    $verifier = new TotpVerifier;
    $currentStep = currentTotpStep();

    expect($verifier->verify(TOTP_TEST_SECRET, totpCodeDriftedBy(0), $currentStep))->toBeNull()
        ->and($verifier->verify(TOTP_TEST_SECRET, totpCodeDriftedBy(-30), $currentStep))->toBeNull()
        ->and($verifier->verify(TOTP_TEST_SECRET, totpCodeDriftedBy(30), $currentStep))->toBe($currentStep + 1);
});

test('a wrong code matches nothing', function (): void {
    expect(new TotpVerifier()->verify(TOTP_TEST_SECRET, '000000', null))->toBeNull();
});
