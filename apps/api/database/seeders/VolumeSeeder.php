<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Clients\Models\Client;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Opusline\BusinessCalendar\FrenchHolidays;

/**
 * The demo account with three years of history behind it: a long client
 * engagement with its tracked time and invoices, the purchases, the returns
 * filed and paid, and a relevé per month of the pro account. The demo's
 * handful of rows hides any screen whose cost grows with an account's age —
 * measure on this instead.
 *
 * Everything lands before the demo's own data starts, so no day, relevé or
 * return is written twice.
 */
final class VolumeSeeder extends DatabaseSeeder
{
    public const int MONTHS = 36;

    private const int WORKDAY_MINUTES = 420;

    private const int OPENING_BALANCE_CENTS = 800_000;

    #[\Override]
    public function run(): void
    {
        parent::run();

        $user = User::query()->where('email', 'test@example.com')->sole();
        $thisMonth = CarbonImmutable::today()->startOfMonth();
        $firstMonth = $thisMonth->subMonths(self::MONTHS);

        $this->seedEngagement($user, $firstMonth, lastMonth: $thisMonth->subMonths(8));
        $this->seedPurchases($user, $firstMonth, lastMonth: $thisMonth->subMonths(3));
        $this->seedReturns($user, $firstMonth, before: $thisMonth->subMonths(12));
        $this->seedStatements($user, $firstMonth);
        $this->numberIssuedInvoices($user);
    }

    /** A daily-rate mission billed at the start of each following month and paid within terms. */
    private function seedEngagement(User $user, CarbonImmutable $firstMonth, CarbonImmutable $lastMonth): void
    {
        $vesterhus = Client::factory()->for($user)->archived()->create([
            'name' => 'Vesterhus',
            'color' => Color::Sage,
            'created_at' => $firstMonth->subMonth(),
        ]);

        $platform = Mission::factory()->for($vesterhus, 'client')->done()->create([
            'user_id' => $user->id,
            'name' => 'Vesterhus plateforme',
            'rate_cents' => 50_000,
            'start_date' => $firstMonth->toDateString(),
            'end_date' => $lastMonth->endOfMonth()->toDateString(),
        ]);

        $holidays = new FrenchHolidays;

        for ($month = $firstMonth; $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $monthHolidays = $holidays->forYear($month->year);
            $entryIds = [];

            for ($day = $month; $day->month === $month->month; $day = $day->addDay()) {
                if ($day->isWeekend() || isset($monthHolidays[$day->toDateString()])) {
                    continue;
                }

                $entryIds[] = TimeEntry::factory()->for($platform, 'mission')->create([
                    'user_id' => $user->id,
                    'date' => $day->toDateString(),
                    'duration_minutes' => self::WORKDAY_MINUTES,
                    'note' => 'Plateforme · développement',
                ])->id;
            }

            $issuedOn = $month->addMonth();
            $invoice = $this->issuedInvoice(
                $user,
                $vesterhus,
                $platform,
                issuedOn: $issuedOn,
                amountHtCents: count($entryIds) * 50_000,
                // Always inside the month it was issued in: a fixed delay would
                // land two payments in a 31-day month and none in the next.
                paidOn: $issuedOn->addDays(24),
                periodMonth: $month,
            );

            TimeEntry::query()->whereKey($entryIds)->update(['invoice_id' => $invoice->id]);
        }
    }

    private function seedPurchases(User $user, CarbonImmutable $firstMonth, CarbonImmutable $lastMonth): void
    {
        for ($month = $firstMonth; $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $this->expense($user, $month->setDay(2), 'Tessaline Télécom', ExpenseCategory::Internet, 'Fibre pro', 4_000);
            $this->expense($user, $month->setDay(5), 'Callisto Télécom', ExpenseCategory::Phone, 'Forfait mobile', 2_900, proShareBp: 7_000);
            $this->expense($user, $month->setDay(8), 'Brouillard Hébergement', ExpenseCategory::Hosting, 'VPS + domaine', 1_439);
            $this->expense($user, $month->setDay(15), 'Kestrel Devtools', ExpenseCategory::Software, 'Organisation · 2 sièges', 4_800, ExpenseVatTreatment::ReverseChargeNonEu);

            if ($month->month % 2 === 0) {
                $this->expense($user, $month->setDay(17), 'Lignes du Nord', ExpenseCategory::Travel, 'Paris → Lyon', 8_900, rateBp: 1_000);
            }
        }
    }

    /** The URSSAF and CA3 returns of each month, filed and paid a fortnight after it closed, and each year's CFE. */
    private function seedReturns(User $user, CarbonImmutable $firstMonth, CarbonImmutable $before): void
    {
        for ($month = $firstMonth; $month->lessThan($before); $month = $month->addMonth()) {
            foreach ([FiscalDeadlineKind::UrssafDeclaration, FiscalDeadlineKind::VatCa3] as $kind) {
                FiscalDeadlineCompletion::factory()->for($user)
                    ->of($kind, $month->format('Y-m'))
                    ->dueOn($month->endOfMonth()->addMonth()->toDateString())
                    ->completedOn($month->endOfMonth()->addDays(12)->toDateString())
                    ->paidOn($month->endOfMonth()->addDays(14)->toDateString())
                    ->create();
            }
        }

        for ($year = $firstMonth->year; $year < CarbonImmutable::today()->year; $year++) {
            FiscalDeadlineCompletion::factory()->for($user)
                ->of(FiscalDeadlineKind::Cfe, (string) $year)
                ->dueOn("{$year}-12-15")
                ->completedOn("{$year}-12-15")
                ->paidOn("{$year}-12-15")
                ->create();
        }
    }

    /**
     * One relevé per month up to the demo's own, holding what such an account
     * actually sees: the invoices collected, the previous month's URSSAF and
     * TVA debits, the December CFE, the salary and the card payments.
     *
     * The salary is what is left above the opening balance, the way a
     * freelance pays themself — and the last one is whatever lands the history
     * on the balance the demo's relevé opens on, so the running balance the
     * movements list walks back from today never drifts.
     */
    private function seedStatements(User $user, CarbonImmutable $firstMonth): void
    {
        $demoStatement = BankStatement::query()->where('user_id', $user->id)->orderBy('period_start')->firstOrFail();
        $settings = $user->settingsOrFail();
        $months = [];

        for ($month = $firstMonth; $month->endOfMonth()->lessThan($demoStatement->period_start); $month = $month->addMonth()) {
            $months[] = $month;
        }

        $balanceCents = self::OPENING_BALANCE_CENTS;
        $lastMonth = array_last($months);

        foreach ($months as $month) {
            $lines = [
                ...$this->collectionLines($user, $month),
                ...$this->returnLines($user, $settings->urssafContributionsOn(...), $month->subMonth()),
                ...$this->purchaseLines($user, $month),
                ...$this->everydayLines($month),
            ];

            if ($month->month === 12) {
                $lines[] = [$month->setDay(15), 'PRLV DGFIP CFE', -58_000];
            }

            $balanceCents += array_sum(array_column($lines, 2));
            $salaryCents = $month === $lastMonth
                ? $balanceCents - $this->openingBalanceCentsOf($demoStatement)
                : max(0, $balanceCents - self::OPENING_BALANCE_CENTS);

            if ($salaryCents > 0) {
                $lines[] = [$month->setDay(28), 'VIR COMPTE PERSO', -$salaryCents];
                $balanceCents -= $salaryCents;

                PersonalTransfer::factory()->for($user)->create([
                    'transferred_on' => $month->setDay(28),
                    'currency' => 'EUR',
                    'amount_cents' => $salaryCents,
                    'note' => 'Salaire',
                ]);
            }

            usort($lines, fn (array $left, array $right): int => $left[0] <=> $right[0]);

            $statement = BankStatement::factory()->for($user)->create([
                'file_name' => 'releve-'.$month->format('Y-m').'.csv',
                'period_start' => $month,
                'period_end' => $month->endOfMonth(),
                'line_count' => count($lines),
                'currency' => 'EUR',
                'closing_balance_cents' => $balanceCents,
                'closing_balance_on' => $month->endOfMonth(),
            ]);

            foreach ($lines as [$bookedOn, $label, $cents]) {
                BankMovement::factory()->for($statement, 'statement')->create([
                    'user_id' => $user->id,
                    'booked_on' => $bookedOn,
                    'label' => $label,
                    'currency' => 'EUR',
                    'amount_cents' => $cents,
                ]);
            }
        }
    }

    private function openingBalanceCentsOf(BankStatement $statement): int
    {
        assert($statement->closing_balance_cents instanceof Money);

        return (int) $statement->closing_balance_cents->getAmount() - (int) $statement->movements()->sum('amount_cents');
    }

    /** @return list<array{CarbonImmutable, string, int}> */
    private function collectionLines(User $user, CarbonImmutable $month): array
    {
        $lines = [];

        foreach ($this->paidIn($user, $month) as $invoice) {
            assert($invoice->paid_on instanceof CarbonImmutable);
            $lines[] = [$invoice->paid_on, 'VIR SEPA '.Str::upper(Str::ascii($invoice->client->name)), (int) $invoice->amount_ttc_cents->getAmount()];
        }

        return $lines;
    }

    /**
     * @param  callable(Money): Money  $contributionsOn
     * @return list<array{CarbonImmutable, string, int}>
     */
    private function returnLines(User $user, callable $contributionsOn, CarbonImmutable $returnMonth): array
    {
        $htCents = 0;
        $vatCents = 0;

        foreach ($this->paidIn($user, $returnMonth) as $invoice) {
            $htCents += (int) $invoice->amount_ht_cents->getAmount();
            $vatCents += (int) $invoice->amount_ttc_cents->getAmount() - (int) $invoice->amount_ht_cents->getAmount();
        }

        if ($htCents === 0) {
            return [];
        }

        $debitMonth = $returnMonth->addMonth();
        $period = $returnMonth->format('m/Y');

        return [
            [$debitMonth->setDay(5), "PRLV URSSAF {$period}", -(int) $contributionsOn(new Money($htCents, 'EUR'))->getAmount()],
            [$debitMonth->setDay(20), "TELEREGLEMENT TVA CA3 {$period}", -$vatCents],
        ];
    }

    /** @return list<array{CarbonImmutable, string, int}> */
    private function purchaseLines(User $user, CarbonImmutable $month): array
    {
        $lines = [];
        $purchases = $user->expenses()
            ->whereBetween('spent_on', [$month->toDateString(), $month->endOfMonth()->toDateString()])
            ->get();

        foreach ($purchases as $expense) {
            $lines[] = [$expense->spent_on, 'CB '.Str::upper(Str::ascii($expense->supplier)), -(int) $expense->amount_ttc_cents->getAmount()];
        }

        return $lines;
    }

    /**
     * The small card payments that never become a journal line: meals on
     * site, train tickets, paper — the bulk of any month's relevé.
     *
     * @return list<array{CarbonImmutable, string, int}>
     */
    private function everydayLines(CarbonImmutable $month): array
    {
        $labels = ['CB MAISON VESTERHUS', 'CB LIGNES DU NORD', 'CB PAPETERIE LOREM'];
        $lines = [[$month->setDay(1), 'FRAIS TENUE DE COMPTE', -900]];

        foreach (range(0, 17) as $index) {
            $lines[] = [$month->setDay($index % 27 + 2), $labels[$index % count($labels)], -(1_200 + $index * 347 % 6_000)];
        }

        return $lines;
    }

    /** @return Collection<int, Invoice> */
    private function paidIn(User $user, CarbonImmutable $month): Collection
    {
        return $user->invoices()
            ->with('client')
            ->where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_on', [$month->toDateString(), $month->endOfMonth()->toDateString()])
            ->get();
    }
}
