<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\DeclarationData;
use App\Domain\Settings\Data\DeclarationListData;
use App\Domain\Settings\Data\FiscalDeadlineData;
use App\Domain\Settings\Models\FiscalDeclaration;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;

/**
 * The declaration ledger: every period you owe a return for, and whether you
 * filed it.
 *
 * The periods, amounts and dates come from ListFiscalDeadlines rather than a
 * second computation — Échéances asks "what is due", this asks "what have I
 * done about it", and the two must never disagree about what July owes.
 */
class ListDeclarations
{
    public function __construct(
        private readonly ListFiscalDeadlines $listFiscalDeadlines,
    ) {}

    public function handle(User $user): DeclarationListData
    {
        $deadlines = $this->listFiscalDeadlines->handle($user);
        $today = $user->settingsOrFail()->today();

        /** @var array<string, FiscalDeclaration> $filed */
        $filed = $user->fiscalDeclarations()
            ->get()
            ->keyBy(static fn (FiscalDeclaration $declaration): string => sprintf(
                '%d|%s',
                $declaration->kind->value,
                $declaration->period,
            ))
            ->all();

        $declarations = array_map(
            function (FiscalDeadlineData $deadline) use ($filed, $today): DeclarationData {
                $record = $filed[sprintf('%d|%s', $deadline->kind->value, $deadline->period)] ?? null;

                return new DeclarationData(
                    kind: $deadline->kind,
                    period: $deadline->period,
                    dueOn: $deadline->dueOn,
                    amount: $deadline->amount,
                    filedOn: $record?->filed_on,
                    declaredAmount: $record?->declared_amount_cents === null
                        ? null
                        : MoneyData::fromMoney($record->declared_amount_cents),
                    isFiled: $record !== null,
                    isLate: $record === null && $deadline->dueOn->lessThan($today),
                );
            },
            $deadlines->deadlines,
        );

        return new DeclarationListData(
            declarations: $declarations,
            hasUncomputedVatSchedule: $deadlines->hasUncomputedVatSchedule,
        );
    }
}
