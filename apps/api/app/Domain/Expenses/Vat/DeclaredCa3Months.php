<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Vat;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use Carbon\CarbonImmutable;

/**
 * The CA3 months the account has marked declared, loaded once per request,
 * and the one rule they impose: a deduction never lands on a declared month.
 *
 * The claim period of a purchase is its own month while that month is open;
 * once declared, anything that reaches it — a late purchase, a receipt
 * attached afterwards, an amount corrected — moves to the first open month
 * after it, where the CA3 lists it as « autre TVA à déduire » (case 21).
 */
final readonly class DeclaredCa3Months
{
    /**
     * @param  array<string, CarbonImmutable>  $declaredOn  `Y-m` => the day it was marked
     */
    private function __construct(private array $declaredOn) {}

    public static function of(int $userId): self
    {
        return self::fromCompletions(FiscalDeadlineCompletion::query()
            ->where('user_id', $userId)
            ->where('kind', FiscalDeadlineKind::VatCa3)
            ->get(['kind', 'period_key', 'completed_on']));
    }

    /**
     * From completions already in hand — only the CA3 ones count.
     *
     * @param  iterable<FiscalDeadlineCompletion>  $completions
     */
    public static function fromCompletions(iterable $completions): self
    {
        $declaredOn = [];

        foreach ($completions as $completion) {
            if ($completion->kind === FiscalDeadlineKind::VatCa3) {
                $declaredOn[$completion->period_key] = $completion->completed_on;
            }
        }

        return new self($declaredOn);
    }

    public function isDeclared(string $month): bool
    {
        return isset($this->declaredOn[$month]);
    }

    /** The earliest month ever marked declared — where a chain of returns can be anchored. */
    public function earliest(): ?string
    {
        $months = array_keys($this->declaredOn);

        return $months === [] ? null : min($months);
    }

    public function declaredOn(string $month): ?CarbonImmutable
    {
        return $this->declaredOn[$month] ?? null;
    }

    /** The month a purchase of $spentMonth is claimed on when written now. */
    public function claimFor(string $spentMonth): string
    {
        $month = $spentMonth;

        while ($this->isDeclared($month)) {
            $month = $this->next($month);
        }

        return $month;
    }

    /** The month a purchase of $spentMonth is claimed on once deferred by hand. */
    public function deferralFor(string $spentMonth): string
    {
        return $this->claimFor($this->next($spentMonth));
    }

    /**
     * The claim after something about the purchase changed: a deferral by
     * hand to a month still open stands, anything else is claimed afresh from
     * the purchase month.
     */
    public function reclaim(string $spentMonth, string $currentClaim): string
    {
        if ($currentClaim > $spentMonth && ! $this->isDeclared($currentClaim)) {
            return $currentClaim;
        }

        return $this->claimFor($spentMonth);
    }

    /**
     * Whether a claim on $claimMonth for a purchase of $spentMonth is a
     * regularisation — the purchase month was declared without it.
     */
    public function isRegularisation(string $spentMonth, string $claimMonth): bool
    {
        return $claimMonth !== $spentMonth && $this->isDeclared($spentMonth);
    }

    private function next(string $month): string
    {
        return CarbonImmutable::parse($month.'-01')->addMonth()->format('Y-m');
    }
}
