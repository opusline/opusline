<?php

declare(strict_types=1);

use App\Domain\Declarations\Vat\Ca3Chain;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Expenses\Vat\DeductibleExpenses;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(fn () => freezeTodayAtUtcNoon());

function chainFrom(User $user, string $firstMonth): Ca3Chain
{
    $first = CarbonImmutable::parse($firstMonth);
    $last = CarbonImmutable::today();

    return new Ca3Chain(
        CollectedInvoices::paidBetween($user, $first, $last),
        DeductibleExpenses::spentOrClaimedBetween($user, $first, $last, DeclaredCa3Months::of($user->id)),
        $first,
    );
}

test('a month reads the same boxes whichever months the chain was asked for before', function (): void {
    $user = vatLiableUser();
    // May's receipted purchase outweighs its collected TVA: June opens on a
    // credit, which July only sees if the chain resumes from where it stopped.
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-05-10')->ttc(600_000));
    paidInvoiceOn($user, '2026-05-20', htCents: 100_000, ttcCents: 120_000);
    paidInvoiceOn($user, '2026-06-20');
    paidInvoiceOn($user, '2026-07-20', htCents: 50_000, ttcCents: 60_000);

    $shared = chainFrom($user, '2026-05-01');

    expect(chainFrom($user, '2026-05-01')->boxes(CarbonImmutable::parse('2026-06-01'))->creditCarried)->toBeGreaterThan(0);

    foreach (['2026-05-01', '2026-07-01', '2026-06-01'] as $month) {
        expect($shared->boxes(CarbonImmutable::parse($month)))
            ->toEqual(chainFrom($user, '2026-05-01')->boxes(CarbonImmutable::parse($month)));
    }
});
