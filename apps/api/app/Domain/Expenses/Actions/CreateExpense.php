<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseInputData;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class CreateExpense
{
    public function __construct(
        private readonly ValidateVatRate $validateVatRate,
        private readonly LinkExpenseToSubscription $linkExpenseToSubscription,
    ) {}

    public function handle(User $user, ExpenseInputData $data): Expense
    {
        $this->validateVatRate->handle($data->vatTreatment, $data->vatRateBp);

        return DB::transaction(function () use ($user, $data): Expense {
            AccountCurrency::assertMatchesAccountUnderLock($user->id, $data->amountTtc);

            $expense = $user->expenses()->create([
                ...ExpenseAttributes::from($data),
                'vat_claim_period' => DeclaredCa3Months::of($user->id)->claimFor($data->month()),
            ]);
            $this->linkExpenseToSubscription->handle($user, $expense, $data);

            return $expense;
        });
    }
}
