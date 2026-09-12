<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Vat;

use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * The first month a CA3 chain runs from, and nothing is carried into.
 *
 * Once a return has been filed, the chain is anchored on the earliest one:
 * what came before was either declared by hand or never owed a CA3, and
 * either way the data cannot say what credit the fisc holds. Before any
 * return, the chain starts where the account's history does. Never later
 * than $latest, the month the caller needs the chain to reach back to.
 */
final class Ca3ChainStart
{
    public static function resolve(User $user, UserSettings $settings, DeclaredCa3Months $declared, CarbonImmutable $latest): CarbonImmutable
    {
        $firstDeclared = $declared->earliest();

        if ($firstDeclared !== null) {
            return min(CarbonImmutable::parse($firstDeclared.'-01'), $latest);
        }

        $candidates = [$latest];

        if ($settings->business_started_on instanceof CarbonImmutable) {
            $candidates[] = $settings->business_started_on->startOfMonth();
        }

        $firstPaidOn = $user->invoices()->where('status', InvoiceStatus::Paid)->min('paid_on');
        $firstSpentOn = $user->expenses()->min('spent_on');

        foreach ([$firstPaidOn, $firstSpentOn] as $date) {
            if (is_string($date)) {
                $candidates[] = CarbonImmutable::parse($date)->startOfMonth();
            }
        }

        return min($candidates);
    }
}
