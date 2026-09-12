<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Vat;

use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * The purchases a span of CA3s reads, bucketed once by purchase month and by
 * claim month so every month's question is a lookup — the twin of
 * CollectedInvoices for the deductible side of the form.
 *
 * Every line of the form follows the claim month, self-assessed purchases
 * included: a purchase reaching an already declared month is filed on the
 * next open one, whatever its treatment.
 */
final readonly class DeductibleExpenses
{
    /** @var array<string, list<Expense>> */
    private array $bySpentMonth;

    /** @var array<string, list<Expense>> */
    private array $byClaimMonth;

    /**
     * @param  Collection<int, Expense>  $expenses  loaded with their media
     */
    public function __construct(Collection $expenses, private DeclaredCa3Months $declared)
    {
        $bySpentMonth = [];
        $byClaimMonth = [];

        foreach ($expenses as $expense) {
            $bySpentMonth[$expense->month()][] = $expense;
            $byClaimMonth[$expense->vat_claim_period][] = $expense;
        }

        $this->bySpentMonth = $bySpentMonth;
        $this->byClaimMonth = $byClaimMonth;
    }

    /** The purchases made in the span, and the ones claimed on a month of it from earlier. */
    public static function spentOrClaimedBetween(User $user, CarbonImmutable $from, CarbonImmutable $to, DeclaredCa3Months $declared): self
    {
        $expenses = $user->expenses()
            ->with('media')
            ->where(fn ($query) => $query
                ->whereBetween('spent_on', [$from->toDateString(), $to->toDateString()])
                ->orWhereBetween('vat_claim_period', [$from->format('Y-m'), $to->format('Y-m')]))
            ->get();

        return new self($expenses, $declared);
    }

    /** Case 2A — HT of what EU suppliers invoiced without TVA, on the month it is filed. */
    public function intraCommunityHtCents(string $month): int
    {
        return $this->htOf($month, ExpenseVatTreatment::ReverseChargeEu);
    }

    /** Case 3B — HT of what non-EU suppliers invoiced without TVA, on the month it is filed. */
    public function nonEuHtCents(string $month): int
    {
        return $this->htOf($month, ExpenseVatTreatment::ReverseChargeNonEu);
    }

    /** The TVA self-assessed on the month's reverse-charged purchases — due on case 08. */
    public function reverseChargeVatCents(string $month): int
    {
        $total = 0;

        foreach ($this->claimedOn($month) as $expense) {
            if ($expense->vat_treatment->isReverseCharge()) {
                $total += (int) $expense->amounts()->assessedVat()->getAmount();
            }
        }

        return $total;
    }

    /**
     * Case 20 — the recoverable TVA claimed on this month's CA3 for purchases
     * whose own month was still open, plus the recoverable share of what was
     * self-assessed on it.
     */
    public function goodsAndServicesVatCents(string $month): int
    {
        return $this->claimedVatCents($month, regularisations: false);
    }

    /** Case 21 — what earlier, already declared months pushed onto this CA3. */
    public function otherDeductibleVatCents(string $month): int
    {
        return $this->claimedVatCents($month, regularisations: true);
    }

    /** Recoverable TVA of the month's own purchases still waiting for a receipt, and how many. */
    public function blockedVatCents(string $month): int
    {
        return $this->sumSpentIn($month, ExpenseVatStatus::Blocked);
    }

    public function blockedCount(string $month): int
    {
        return count(array_filter(
            $this->spentIn($month),
            fn (Expense $expense): bool => $expense->vatStatus($this->declared) === ExpenseVatStatus::Blocked,
        ));
    }

    /** Recoverable TVA of the month's own purchases claimed on a later CA3. */
    public function deferredVatCents(string $month): int
    {
        return $this->sumSpentIn($month, ExpenseVatStatus::Deferred);
    }

    /**
     * The recoverable TVA of the claimable purchases made in the span, on the
     * purchase date rather than the claim month — the annual CA12 deducts
     * the year's purchases without a monthly claim period.
     */
    public function receiptedRecoverableCents(CarbonImmutable $from, CarbonImmutable $to): int
    {
        $total = 0;

        foreach ($this->bySpentMonth as $expenses) {
            foreach ($expenses as $expense) {
                if ($expense->spent_on->betweenIncluded($from, $to) && $expense->vatStatus($this->declared)->isClaimed()) {
                    $total += $this->recoverable($expense);
                }
            }
        }

        return $total;
    }

    public function countSpentIn(string $month): int
    {
        return count($this->spentIn($month));
    }

    private function claimedVatCents(string $month, bool $regularisations): int
    {
        $total = 0;

        foreach ($this->claimedOn($month) as $expense) {
            if ($this->isClaimed($expense) && $this->landsOnCase21($expense) === $regularisations) {
                $total += $this->recoverable($expense);
            }
        }

        return $total;
    }

    private function isClaimed(Expense $expense): bool
    {
        if ($expense->vat_treatment->isReverseCharge()) {
            return true;
        }

        return $expense->vatStatus($this->declared)->isClaimed();
    }

    /**
     * A self-assessed purchase is deducted on the return that assesses it,
     * however late it arrives: the deduction stays in case 20 next to its
     * own case 08 line instead of reading as a correction of an older month.
     */
    private function landsOnCase21(Expense $expense): bool
    {
        return ! $expense->vat_treatment->isReverseCharge() && $expense->isRegularisation($this->declared);
    }

    private function sumSpentIn(string $month, ExpenseVatStatus $status): int
    {
        $total = 0;

        foreach ($this->spentIn($month) as $expense) {
            if ($expense->vatStatus($this->declared) === $status) {
                $total += $this->recoverable($expense);
            }
        }

        return $total;
    }

    private function htOf(string $month, ExpenseVatTreatment $treatment): int
    {
        $total = 0;

        foreach ($this->claimedOn($month) as $expense) {
            if ($expense->vat_treatment === $treatment) {
                $total += (int) $expense->amount_ht_cents->getAmount();
            }
        }

        return $total;
    }

    /** @return list<Expense> */
    private function spentIn(string $month): array
    {
        return $this->bySpentMonth[$month] ?? [];
    }

    /** @return list<Expense> */
    private function claimedOn(string $month): array
    {
        return $this->byClaimMonth[$month] ?? [];
    }

    private function recoverable(Expense $expense): int
    {
        return (int) $expense->amounts()->recoverableVat($expense->pro_share_bp)->getAmount();
    }
}
