<?php

declare(strict_types=1);

use App\Domain\Declarations\Vat\Ca3Boxes;
use App\Domain\Declarations\Vat\Ca3Inputs;

function ca3Inputs(int ...$overrides): Ca3Inputs
{
    $defaults = [
        'salesHt' => 0, 'collectedVat' => 0, 'intraCommunityHt' => 0, 'nonEuHt' => 0, 'reverseChargeVat' => 0,
        'fixedAssetsVat' => 0, 'goodsAndServicesVat' => 0, 'otherDeductibleVat' => 0, 'creditCarried' => 0,
    ];

    return new Ca3Inputs(...[...$defaults, ...$overrides]);
}

test('the base adds the self-assessed purchases to the sales and the tax column adds their TVA', function (): void {
    $boxes = Ca3Boxes::compute(ca3Inputs(salesHt: 840_000, collectedVat: 168_000, intraCommunityHt: 3_120, nonEuHt: 6_800, reverseChargeVat: 1_984, goodsAndServicesVat: 1_984));

    expect($boxes->taxableBase)->toBe(849_920)
        ->and($boxes->collected)->toBe(169_984)
        ->and($boxes->due)->toBe(168_000)
        ->and($boxes->credit)->toBe(0);
});

test('the deductible lines and the carried credit come off what is due', function (): void {
    $boxes = Ca3Boxes::compute(ca3Inputs(collectedVat: 168_000, goodsAndServicesVat: 7_400, otherDeductibleVat: 1_000, creditCarried: 46_600));

    expect($boxes->due)->toBe(113_000)
        ->and($boxes->credit)->toBe(0);
});

test('deducting more than was collected leaves a credit and nothing due', function (): void {
    $boxes = Ca3Boxes::compute(ca3Inputs(collectedVat: 55_000, goodsAndServicesVat: 101_600));

    expect($boxes->due)->toBe(0)
        ->and($boxes->credit)->toBe(46_600)
        ->and($boxes->creditIsRefundable())->toBeFalse();
});

test('a credit from the refund floor up may be claimed back rather than carried', function (): void {
    expect(Ca3Boxes::compute(ca3Inputs(goodsAndServicesVat: 76_000))->creditIsRefundable())->toBeTrue()
        ->and(Ca3Boxes::compute(ca3Inputs(goodsAndServicesVat: 75_999))->creditIsRefundable())->toBeFalse();
});
