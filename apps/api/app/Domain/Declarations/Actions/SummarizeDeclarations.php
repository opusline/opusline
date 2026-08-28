<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Actions;

use App\Domain\Declarations\Data\DeclarationsData;
use App\Domain\Declarations\Data\UrssafDeclarationData;
use App\Domain\Declarations\Data\VatDeclarationData;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * The figures a French freelancer retypes into the fisc's forms, for the most
 * recently closed period. Both blocks are cash basis: URSSAF and micro-régime
 * TVA declare what was collected, not what was invoiced.
 *
 * A period with no collections still returns its zeros: a zero month must be
 * declared to URSSAF too, so an empty screen would be the wrong kind of quiet.
 *
 * Known limit: a closed period is not the same as an open declaration window.
 * A quarterly account spends two months of every quarter looking at a period
 * whose deadline has already passed, and nothing here says so.
 *
 * @phpstan-type ClosedPeriod array{start: CarbonImmutable, end: CarbonImmutable, key: string}
 */
class SummarizeDeclarations
{
    public function handle(User $user): DeclarationsData
    {
        $settings = $user->settingsOrFail();

        if (! $settings->hasFrenchFiscality()) {
            return new DeclarationsData(urssaf: null, vat: null);
        }

        $today = $settings->today();

        $urssafPeriod = $this->closedPeriod(
            $today,
            $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly,
        );

        // Only réel normal declares TVA monthly on the CA3; réel simplifié files
        // an annual CA12 this helper does not cover yet, and the franchise en
        // base files nothing.
        $vatPeriod = $settings->vat_regime === VatRegime::ReelNormal
            ? $this->closedPeriod($today, quarterly: false)
            : null;

        $collected = $this->collectedAcross($user, $urssafPeriod, $vatPeriod);

        return new DeclarationsData(
            urssaf: $this->urssaf($settings, $collected, $urssafPeriod),
            vat: $vatPeriod === null ? null : $this->vat($settings, $collected, $vatPeriod),
        );
    }

    /**
     * The period that closed most recently — the one whose figures the forms
     * are asking for now.
     *
     * @return ClosedPeriod
     */
    private function closedPeriod(CarbonImmutable $today, bool $quarterly): array
    {
        $end = ($quarterly ? $today->firstOfQuarter() : $today->startOfMonth())->subDay();
        $start = $quarterly ? $end->firstOfQuarter() : $end->startOfMonth();

        return [
            'start' => $start,
            'end' => $end,
            'key' => $quarterly ? $start->year.'-Q'.$start->quarter : $start->format('Y-m'),
        ];
    }

    /**
     * One query over the widest window either block reads — the two coincide
     * entirely for a monthly account.
     *
     * @param  ClosedPeriod  $urssafPeriod
     * @param  ?ClosedPeriod  $vatPeriod
     */
    private function collectedAcross(User $user, array $urssafPeriod, ?array $vatPeriod): CollectedInvoices
    {
        if ($vatPeriod === null) {
            return CollectedInvoices::paidBetween($user, $urssafPeriod['start'], $urssafPeriod['end']);
        }

        return CollectedInvoices::paidBetween(
            $user,
            min($urssafPeriod['start'], $vatPeriod['start']),
            max($urssafPeriod['end'], $vatPeriod['end']),
        );
    }

    /**
     * @param  ClosedPeriod  $period
     */
    private function urssaf(
        UserSettings $settings,
        CollectedInvoices $collected,
        array $period,
    ): UrssafDeclarationData {
        $currency = $settings->currency->value;

        return new UrssafDeclarationData(
            period: $period['key'],
            periodicity: $settings->urssaf_periodicity,
            base: MoneyData::fromMoney(new Money($collected->htCents($period['start'], $period['end']), $currency)),
        );
    }

    /**
     * @param  ClosedPeriod  $period
     */
    private function vat(
        UserSettings $settings,
        CollectedInvoices $collected,
        array $period,
    ): VatDeclarationData {
        $currency = $settings->currency->value;

        return new VatDeclarationData(
            period: $period['key'],
            regime: $settings->vat_regime,
            salesHt: MoneyData::fromMoney(new Money($collected->htCents($period['start'], $period['end']), $currency)),
            collected: MoneyData::fromMoney(new Money($collected->vatCents($period['start'], $period['end']), $currency)),
            rateBp: $collected->uniqueRateBp($period['start'], $period['end'], $settings->default_vat_rate_bp),
        );
    }
}
