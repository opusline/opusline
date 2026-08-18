<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;

test('resolves the rate a new invoice starts on', function (
    VatRegime $regime,
    int $accountRateBp,
    ?int $clientRateBp,
    int $expectedRateBp,
): void {
    $settings = new UserSettings(['vat_regime' => $regime, 'default_vat_rate_bp' => $accountRateBp]);

    expect($settings->effectiveVatRateBp($clientRateBp))->toBe($expectedRateBp);
})->with([
    'the account default when the client has none' => [VatRegime::ReelNormal, 2000, null, 2000],
    'the client own rate over the account default' => [VatRegime::ReelNormal, 2000, 550, 550],
    'a client billed no TVA at all' => [VatRegime::ReelNormal, 2000, 0, 0],
    'the franchise en base over the account default' => [VatRegime::FranchiseEnBase, 2000, null, 0],
    'the franchise en base over a client own rate' => [VatRegime::FranchiseEnBase, 2000, 2000, 0],
    'the réel simplifié is liable too' => [VatRegime::ReelSimplifie, 1000, null, 1000],
]);
