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

        $orvella = Client::factory()->for($user)->create([
            'name' => 'Orvella',
            'color' => Color::Indigo,
            'billing_contact_name' => 'Salomé Vidal',
            'billing_email' => 'compta@orvella.example',
            'created_at' => now()->subMonths(6),
        ]);

        // Two forfaits, because the screens need both halves of the story: one
        // mid-flight with a deposit behind it and instalments still to bill, one
        // finished and billed to the last cent.
        // The target is what turns 21 days of work into a verdict: 8 000 € at a
        // 550 €/j target buys ~14,5 days, so this forfait is knowingly over budget.
        $orvellaRefonte = Mission::factory()->for($orvella, 'client')->fixed()->create([
            'user_id' => $user->id,
            'name' => 'Orvella refonte',
            'rate_cents' => 800_000,
            'target_rate_cents' => 55_000,
            'start_date' => CarbonImmutable::today()->subMonths(3)->toDateString(),
        ]);

        $orvellaIdentite = Mission::factory()->for($orvella, 'client')->fixed()->done()->create([
            'user_id' => $user->id,
            'name' => 'Orvella identité',
            'rate_cents' => 240_000,
            'target_rate_cents' => 55_000,
            'start_date' => CarbonImmutable::today()->subMonths(6)->toDateString(),
            'end_date' => CarbonImmutable::today()->subMonths(4)->toDateString(),
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
        $this->seedForfaits($user, $orvella, $orvellaRefonte, $orvellaIdentite);

        // Numbering is an account-wide concern and runs last on purpose: it reads
        // every issued invoice in date order, so any written after it would keep
        // the blank reference that marks a draft.
        $this->numberIssuedInvoices($user);

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
    }

    /**
     * The two fixed-price missions, with the time tracked on them and the
     * instalments already billed.
     *
     * The point of the demo is that these two never meet: the time says what the
     * forfait cost to deliver, the invoices say what it earned, and no figure on
     * any screen multiplies one by the other. Orvella refonte is deliberately
     * over its worth — 21 days on an 8 000 € deal is a 380 €/j margin, which is
     * exactly the thing tracking time on a forfait is meant to reveal.
     */
    private function seedForfaits(
        User $user,
        Client $orvella,
        Mission $refonte,
        Mission $identite,
    ): void {
        $today = CarbonImmutable::today();

        $this->seedForfaitTimeEntries($user, $refonte, $today->subMonths(3), 21, [
            'Cadrage et ateliers',
            'Maquettes intégrées',
            'Tunnel de commande',
            'Recette staging',
        ]);

        $this->seedForfaitTimeEntries($user, $identite, $today->subMonths(6), 6, [
            'Recherche typographique',
            'Déclinaisons logo',
        ]);

        // 30 % at kickoff, then 40 % once staging was up: the remaining 30 % is
        // what the mission's bar reports as still to bill. Neither invoice covers
        // any tracked time — a forfait bills a price, so timeEntryIds stays empty
        // and the entries never leave the mission's own history.
        $kickoff = $this->issuedInvoice(
            $user,
            $orvella,
            $refonte,
            issuedOn: $today->subMonths(3)->addDays(3),
            amountHtCents: 240_000,
            paidOn: $today->subMonths(2)->addDays(9),
        );

        $staging = $this->issuedInvoice(
            $user,
            $orvella,
            $refonte,
            issuedOn: $today->subDays(12),
            amountHtCents: 320_000,
            paidOn: null,
        );

        // The schedule the two invoices came from, with the last step overdue so
        // "À traiter" has one of each kind to show.
        $this->billingStep($user, $refonte, 0, 'Lancement', 240_000, invoice: $kickoff);
        $this->billingStep($user, $refonte, 1, 'Mise en recette', 320_000, invoice: $staging);
        $this->billingStep(
            $user,
            $refonte,
            2,
            'Mise en production',
            240_000,
            dueOn: $today->subDays(4),
        );

        // Billed in one go, the way most forfaits actually are.
        $this->issuedInvoice(
            $user,
            $orvella,
            $identite,
            issuedOn: $today->subMonths(4),
            amountHtCents: 240_000,
            paidOn: $today->subMonths(4)->addDays(21),
        );
    }

    /**
     * One instalment of a forfait. A step already billed points at its invoice;
     * one still to bill carries the date it was expected on.
     */
    private function billingStep(
        User $user,
        Mission $mission,
        int $position,
        string $label,
        int $amountCents,
        ?Invoice $invoice = null,
        ?CarbonImmutable $dueOn = null,
    ): void {
        $user->billingSteps()->create([
            'mission_id' => $mission->id,
            'label' => $label,
            // Currency before the *_cents key, as everywhere MoneyIntegerCast reads it.
            'currency' => 'EUR',
            'amount_cents' => $amountCents,
            'position' => $position,
            'due_on' => $dueOn,
            'invoice_id' => $invoice?->id,
        ]);
    }

    /**
     * Working days walked back from a start date, so a forfait carries a history
     * worth reading rather than a single lump.
     *
     * @param  non-empty-list<string>  $notes
     */
    private function seedForfaitTimeEntries(
        User $user,
        Mission $mission,
        CarbonImmutable $startedOn,
        int $days,
        array $notes,
    ): void {
        $written = 0;
        $cursor = $startedOn;

        while ($written < $days) {
            if (! $cursor->isWeekend()) {
                TimeEntry::factory()->for($mission, 'mission')->create([
                    'user_id' => $user->id,
                    'date' => $cursor->toDateString(),
                    'duration_minutes' => $written % 4 === 3 ? 210 : 420,
                    'note' => $notes[$written % count($notes)],
                ]);

                $written++;
            }

            $cursor = $cursor->addDay();
        }
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
