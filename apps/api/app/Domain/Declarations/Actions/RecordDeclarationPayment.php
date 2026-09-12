<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Actions;

use App\Domain\Deadlines\Actions\RecordFiscalDeadlinePayment;
use App\Domain\Deadlines\Actions\ResolveExpectedCfe;
use App\Domain\Deadlines\Calendar\ExpectedCfe;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Expenses\Actions\CreateExpense;
use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;

/**
 * Dates the payment, and for the running year's CFE also books it: the bill
 * is a charge of the business (Taxes, hors TVA), and the journal should
 * show it the day it is paid rather than wait for a receipt nobody keeps.
 * Written once per year, at the amount the account expects — the avis, or
 * the estimate standing in for it. An older year's bill cannot be guessed,
 * so only its payment date is kept.
 */
class RecordDeclarationPayment
{
    public function __construct(
        private readonly RecordFiscalDeadlinePayment $recordFiscalDeadlinePayment,
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
        private readonly CreateExpense $createExpense,
    ) {}

    public function handle(User $user, FiscalDeadlineKind $kind, string $periodKey): void
    {
        $this->recordFiscalDeadlinePayment->handle($user, $kind, $periodKey);

        if ($kind === FiscalDeadlineKind::Cfe && (int) $periodKey === $user->settingsOrFail()->today()->year) {
            $this->bookCfe($user, $periodKey);
        }
    }

    private function bookCfe(User $user, string $year): void
    {
        $settings = $user->settingsOrFail();
        $expected = $this->resolveExpectedCfe->handle($settings);
        $description = "CFE {$year}";

        if (! $expected instanceof ExpectedCfe || $user->expenses()->where('category', ExpenseCategory::Taxes)->where('description', $description)->exists()) {
            return;
        }

        $this->createExpense->handle($user, new ExpenseInputData(
            supplier: 'DGFiP',
            spentOn: $settings->today()->toDateString(),
            category: ExpenseCategory::Taxes,
            amountTtc: MoneyData::fromMoney($expected->amount),
            vatTreatment: ExpenseVatTreatment::Exempt,
            vatRateBp: 0,
            description: $description,
        ));
    }
}
