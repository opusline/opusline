<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Actions\MaterializeCraDays;
use App\Domain\Cra\Actions\WriteCraDays;
use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Invoices\Actions\ComputeInvoiceAmounts;
use App\Domain\Invoices\Actions\ValueTrackedTime;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Enums\Color;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $user->settings()->sole()->update([
            'vat_regime' => VatRegime::ReelNormal,
            'treasury_buffer_cents' => 150_000,
        ]);

        $nordlys = Client::factory()->for($user)->intermediary()->create([
            'name' => 'Nordlys',
            'color' => Color::Amber,
            'siret' => '443 061 841 00047',
            'billing_contact_name' => 'Camille Dupont',
            'billing_email' => 'factures@nordlys.example',
            'created_at' => now()->subMonths(17),
        ]);

        $callistoFront = Mission::factory()->for($nordlys, 'client')->throughEsn('Callisto')->create([
            'user_id' => $user->id,
            'name' => 'Callisto front',
            'rate_cents' => 55_000,
            'cra_required' => true,
            'start_date' => '2025-03-03',
        ]);

        Mission::factory()->for($nordlys, 'client')->throughEsn('Callisto')->done()->create([
            'user_id' => $user->id,
            'name' => 'Callisto socle API',
            'rate_cents' => 52_000,
            'cra_required' => true,
            'start_date' => '2025-03-03',
            'end_date' => '2026-05-29',
        ]);

        $lunaprint = Client::factory()->for($user)->create([
            'name' => 'Lunaprint',
            'color' => Color::Slate,
            'created_at' => now()->subMonths(11),
        ]);

        $lunaprintMaintenance = Mission::factory()->for($lunaprint, 'client')->hourly()->create([
            'user_id' => $user->id,
            'name' => 'Lunaprint maintenance',
        ]);

        Client::factory()->for($user)->archived()->create([
            'name' => 'Studio Lorem',
            'color' => Color::Plum,
            'created_at' => now()->subMonths(20),
        ]);

        Client::factory()->for($user)->create([
            'name' => 'Ateliers Ruche',
            'color' => Color::Sage,
            'created_at' => now()->subDays(2),
        ]);

        $perso = Client::factory()->for($user)->internal()->create([
            'name' => 'Perso',
            'color' => Color::Stone,
            'created_at' => now()->subMonths(20),
        ]);

        $opusline = Mission::factory()->for($perso, 'client')->hourly()->nonBillable()->create([
            'user_id' => $user->id,
            'name' => 'Opusline',
        ]);

        // Last month belongs to the CRA below, so the recent-entries walk stops at the
        // month boundary rather than writing days the CRA already reports.
        $this->seedRecentTimeEntries(
            $user,
            $callistoFront,
            $lunaprintMaintenance,
            $opusline,
            notBefore: CarbonImmutable::today()->startOfMonth(),
        );
        $this->seedPreviousMonthCra($user, $callistoFront);
        $this->seedInvoiceHistory($user, $nordlys, $callistoFront, $lunaprint, $lunaprintMaintenance);

        RunningTimer::factory()
            ->for($lunaprintMaintenance, 'mission')
            ->startedAt(CarbonImmutable::now()->subHours(2))
            ->create([
                'user_id' => $user->id,
                'note' => 'Correctif impression recto-verso',
            ]);
    }

    private function seedRecentTimeEntries(
        User $user,
        Mission $daily,
        Mission $hourly,
        Mission $nonBillable,
        CarbonImmutable $notBefore,
    ): void {
        $workedDays = [];
        $cursor = CarbonImmutable::today();

        while (count($workedDays) < 10 && $cursor->greaterThanOrEqualTo($notBefore)) {
            if (! $cursor->isWeekend()) {
                $workedDays[] = $cursor;
            }

            $cursor = $cursor->subDay();
        }

        $missionNotes = [
            'Sprint 24 · specs',
            'Filtre agences',
            'Revue PR',
            'Cadrage V2',
            'Rétro + backlog',
        ];

        $sideProjectNotes = [
            'Écran semaine',
            'Calculateur virement',
            'Notes de version',
        ];

        foreach ($workedDays as $index => $day) {
            TimeEntry::factory()->for($daily, 'mission')->create([
                'user_id' => $user->id,
                'date' => $day->toDateString(),
                'duration_minutes' => $index % 5 === 0 ? 210 : 420,
                'note' => $missionNotes[$index % count($missionNotes)],
            ]);

            if ($index % 3 === 1) {
                TimeEntry::factory()->for($nonBillable, 'mission')->nonBillable()->create([
                    'user_id' => $user->id,
                    'date' => $day->toDateString(),
                    'duration_minutes' => $index % 2 === 1 ? 120 : 90,
                    'note' => $sideProjectNotes[intdiv($index, 3) % count($sideProjectNotes)],
                ]);
            }

            if ($index % 3 !== 0) {
                continue;
            }

            TimeEntry::factory()->for($hourly, 'mission')->create([
                'user_id' => $user->id,
                'date' => $day->toDateString(),
                'duration_minutes' => 95,
                'note' => 'Correctifs après mise en production.',
            ]);
        }
    }

    /**
     * A full month of work on the ESN mission, already reported and sent. The CRA screen
     * needs both piles to be worth looking at: one month to produce, one already gone.
     */
    private function seedPreviousMonthCra(User $user, Mission $mission): void
    {
        // startOfMonth first: subMonth from a 29th-or-later day overflows past
        // short months and lands the CRA in the wrong one.
        $month = CarbonImmutable::today()->startOfMonth()->subMonth();
        $holidays = new FrenchHolidays()->forYear($month->year);

        for ($day = $month; $day->month === $month->month; $day = $day->addDay()) {
            if ($day->isWeekend()) {
                continue;
            }
            if (isset($holidays[$day->toDateString()])) {
                continue;
            }

            TimeEntry::factory()->for($mission, 'mission')->create([
                'user_id' => $user->id,
                'date' => $day->toDateString(),
                'duration_minutes' => $day->dayOfWeek === CarbonImmutable::FRIDAY ? 210 : 420,
                'note' => 'Sprint 23 · développement',
            ]);
        }

        $cra = $mission->cras()->create([
            'user_id' => $user->id,
            'month' => $month,
            'status' => CraStatus::Sent,
            'sent_on' => $month->endOfMonth()->addDay(),
        ]);

        // Built by the actions the app itself uses, so the demo CRA agrees with its own
        // tracked time by construction rather than because two copies of the rounding
        // rule were kept in step by hand.
        app(WriteCraDays::class)->handle(
            $cra,
            app(MaterializeCraDays::class)->handle($mission, $month),
        );
    }

    /**
     * Months of invoicing across both billing clients, in every state the screens
     * know: paid history for the Revenus chart and its trend, one invoice waiting
     * to be paid, one overdue with a reminder noted, and a draft.
     */
    private function seedInvoiceHistory(
        User $user,
        Client $nordlys,
        Mission $callistoFront,
        Client $lunaprint,
        Mission $lunaprintMaintenance,
    ): void {
        $thisMonth = CarbonImmutable::today()->startOfMonth();

        // Five paid ESN months at 550 €/j, a quiet month in the middle so the
        // chart has some relief. Each is issued the 1st of the following month
        // and paid within terms — so Facturé and Encaissé tell different stories.
        foreach ([6 => 18.0, 5 => 19.5, 4 => 12.0, 3 => 21.0, 2 => 17.0] as $monthsAgo => $daysWorked) {
            $month = $thisMonth->subMonths($monthsAgo);
            $issuedOn = $month->addMonth();

            $this->issuedInvoice(
                $user,
                $nordlys,
                $callistoFront,
                issuedOn: $issuedOn,
                amountHtCents: (int) round($daysWorked * 55_000),
                paidOn: $issuedOn->addDays(24 + $monthsAgo * 3),
                periodMonth: $month,
            );
        }

        // Last month's invoice is priced from its own tracked time and linked to
        // it, so the CRA, the invoice and the "reste à facturer" figures agree by
        // construction — and the current month opens with revenue to show.
        $craMonth = $thisMonth->subMonth();
        $craEntries = $user->timeEntries()
            ->where('mission_id', $callistoFront->id)
            ->whereBetween('date', [$craMonth->toDateString(), $craMonth->endOfMonth()->toDateString()])
            ->get();

        $valueTrackedTime = app(ValueTrackedTime::class);
        $workdayMinutes = $user->settingsOrFail()->workday_minutes;
        $amount = new Money(0, 'EUR');

        foreach ($craEntries as $entry) {
            $amount = $amount->add($valueTrackedTime->measure($callistoFront, $entry, $workdayMinutes)['value']);
        }

        $craInvoice = $this->issuedInvoice(
            $user,
            $nordlys,
            $callistoFront,
            issuedOn: $thisMonth,
            amountHtCents: (int) $amount->getAmount(),
            paidOn: null,
            periodMonth: $craMonth,
        );

        TimeEntry::query()->whereKey($craEntries->modelKeys())->update(['invoice_id' => $craInvoice->id]);

        // A small maintenance invoice already collected…
        $this->issuedInvoice(
            $user,
            $lunaprint,
            $lunaprintMaintenance,
            issuedOn: $thisMonth->subMonths(3)->addDays(11),
            amountHtCents: 76_500,
            paidOn: $thisMonth->subMonths(3)->addDays(30),
        );

        // …and one that should have been paid a month ago, reminded since.
        $overdue = $this->issuedInvoice(
            $user,
            $lunaprint,
            $lunaprintMaintenance,
            issuedOn: CarbonImmutable::today()->subDays(75),
            amountHtCents: 96_000,
            paidOn: null,
        );
        $overdue->events()->create([
            'kind' => InvoiceEventKind::Reminded,
            'occurred_on' => CarbonImmutable::today()->subDays(10),
        ]);

        // A draft still being put together, excluded from every revenue figure.
        $draft = Invoice::factory()->for($lunaprint, 'client')->create([
            'user_id' => $user->id,
            'mission_id' => $lunaprintMaintenance->id,
            'issued_on' => CarbonImmutable::today(),
            'due_on' => CarbonImmutable::today()->addDays(45),
            'currency' => 'EUR',
            'amount_ht_cents' => 42_500,
            'amount_ttc_cents' => $this->ttcCentsFor(42_500),
            'vat_rate_bp' => 2_000,
        ]);
        $draft->events()->create([
            'kind' => InvoiceEventKind::Created,
            'occurred_on' => CarbonImmutable::today(),
        ]);

        $this->numberIssuedInvoices($user);
    }

    /**
     * An issued invoice with its lifecycle events, paid when a payment date is
     * given. References are left blank here and assigned in issue order at the
     * end, whatever order the rows were written in.
     */
    private function issuedInvoice(
        User $user,
        Client $client,
        Mission $mission,
        CarbonImmutable $issuedOn,
        int $amountHtCents,
        ?CarbonImmutable $paidOn,
        ?CarbonImmutable $periodMonth = null,
    ): Invoice {
        // Seeding bypasses the API's before-or-equal-today rule, so a payment
        // offset landing past a short month must not produce a future payment.
        $paidOn = $paidOn?->min(CarbonImmutable::yesterday());

        $invoice = Invoice::factory()->for($client, 'client')->create([
            'user_id' => $user->id,
            'mission_id' => $mission->id,
            'status' => $paidOn === null ? InvoiceStatus::Sent : InvoiceStatus::Paid,
            'issued_on' => $issuedOn,
            'due_on' => $issuedOn->addDays(45),
            'paid_on' => $paidOn,
            'period_start' => $periodMonth,
            'period_end' => $periodMonth?->endOfMonth(),
            // Currency must precede the *_cents keys: MoneyIntegerCast reads the
            // currency column when it writes the amount.
            'currency' => 'EUR',
            'amount_ht_cents' => $amountHtCents,
            'amount_ttc_cents' => $this->ttcCentsFor($amountHtCents),
            'vat_rate_bp' => 2_000,
        ]);

        $invoice->events()->create(['kind' => InvoiceEventKind::Created, 'occurred_on' => $issuedOn]);
        $invoice->events()->create(['kind' => InvoiceEventKind::Sent, 'occurred_on' => $issuedOn]);

        if ($paidOn !== null) {
            $invoice->events()->create(['kind' => InvoiceEventKind::Paid, 'occurred_on' => $paidOn]);
        }

        return $invoice;
    }

    /** The domain's own gross computation, at the seeder's flat 20 % rate. */
    private function ttcCentsFor(int $amountHtCents): int
    {
        return (int) app(ComputeInvoiceAmounts::class)
            ->ttcFor(new Money($amountHtCents, 'EUR'), 2_000)
            ->getAmount();
    }

    /**
     * One sequence per year like the default AAAA-NNN format produces, assigned
     * by issue date so the references read chronologically on the list.
     */
    private function numberIssuedInvoices(User $user): void
    {
        $countByYear = [];

        $issued = $user->invoices()
            ->where('status', '!=', InvoiceStatus::Draft)
            ->orderBy('issued_on')
            ->orderBy('id')
            ->get();

        foreach ($issued as $invoice) {
            $year = $invoice->issued_on->year;
            $countByYear[$year] = ($countByYear[$year] ?? 0) + 1;

            $invoice->update(['number' => sprintf('%d-%03d', $year, $countByYear[$year])]);
        }
    }
}
