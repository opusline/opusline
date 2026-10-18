<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\InvoicingMode;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

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
            'billing_contact_name' => 'Ingrid Solberg',
            'billing_email' => 'faktura@vesterhus.example',
            'billing_address_line1' => '27 rue des Halles',
            'billing_postal_code' => '35000',
            'billing_city' => 'Rennes',
            'created_at' => $firstMonth->subMonth(),
        ]);
        $settings = $user->settingsOrFail();
        $settings->update(['invoicing_mode' => InvoicingMode::Opusline]);

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
            $this->writeInOpusline($user, $invoice, $month, count($entryIds));

            // Every sixth month the client is granted a day off the bill before paying it.
            if ($month->diffInMonths($firstMonth, absolute: true) % 6 === 5) {
                $this->grantGesture($user, $invoice, $issuedOn->addDays(5));
            }
        }

        $this->seedQuotes($user, $vesterhus, $platform, $firstMonth, $lastMonth);
        $this->numberDocuments($user);
    }

    /**
     * Turns a seeded invoice into one written in Opusline, as issuing it would
     * have left it: its line, its frozen parties, and the e-mail that sent it.
     */
    private function writeInOpusline(User $user, Invoice $invoice, CarbonImmutable $period, int $days): void
    {
        $settings = $user->settingsOrFail();
        $invoice->loadMissing('client');

        $invoice->update([
            'source' => InvoiceSource::Opusline,
            'title' => 'Plateforme · '.$period->format('m/Y'),
            'language' => DocumentLanguage::French,
            'payment_terms_days' => 45,
            'show_iban' => true,
            'show_email' => true,
            'operation_category' => $settings->operation_category,
            'seller_snapshot' => DocumentParties::seller($settings, true, true),
            'buyer_snapshot' => DocumentParties::buyer($invoice->client),
        ]);
        $invoice->lines()->create([
            'position' => 0,
            'label' => 'Développement de la plateforme',
            'quantity_milli' => $days * 1_000,
            'unit' => LineUnit::Day,
            'currency' => 'EUR',
            'unit_price_cents' => 50_000,
            'vat_rate_bp' => 2_000,
            'total_ht_cents' => $days * 50_000,
        ]);
        DocumentEmail::factory()->create([
            'user_id' => $user->id,
            'invoice_id' => $invoice->id,
            'kind' => EmailTemplateKind::NewInvoice,
            'recipients' => [$invoice->client->billing_email],
            'subject' => 'Facture de la plateforme',
            'body' => "Bonjour Ingrid,\n\nVoici la facture du mois.\n\nBonne journée,",
            'sent_at' => $invoice->issued_on,
        ]);
        $invoice->events()->create(['kind' => InvoiceEventKind::Emailed, 'occurred_on' => $invoice->issued_on, 'note' => $invoice->client->billing_email]);
    }

    /**
     * A day taken off before the client paid: the credit note reduces what is
     * due, and the payment the bank statement shows is the remainder.
     */
    private function grantGesture(User $user, Invoice $invoice, CarbonImmutable $issuedOn): void
    {
        $settings = $user->settingsOrFail();
        $user->creditNotes()->create([
            'invoice_id' => $invoice->id,
            'client_id' => $invoice->client_id,
            // A placeholder numberDocuments() replaces once every note exists, in issue order.
            'number' => 'A-seed-'.$invoice->id,
            'status' => CreditNoteStatus::Settled,
            'kind' => CreditNoteKind::Partial,
            'reason' => CreditNoteReason::CommercialGesture,
            'detail' => 'Une journée offerte sur le mois',
            'settlement' => CreditNoteSettlement::ReducesBalance,
            'language' => DocumentLanguage::French,
            'issued_on' => $issuedOn,
            'settled_on' => $issuedOn,
            'seller_snapshot' => DocumentParties::seller($settings, true, true),
            'buyer_snapshot' => DocumentParties::buyer($invoice->client),
            'currency' => 'EUR',
            'amount_ht_cents' => 50_000,
            'amount_ttc_cents' => 60_000,
            'vat_rate_bp' => 2_000,
        ])->lines()->create([
            'position' => 0,
            'label' => 'Journée offerte',
            'quantity_milli' => 1_000,
            'unit' => LineUnit::Day,
            'currency' => 'EUR',
            'unit_price_cents' => 50_000,
            'vat_rate_bp' => 2_000,
            'total_ht_cents' => 50_000,
        ]);
        $invoice->events()->create(['kind' => InvoiceEventKind::CreditNoteIssued, 'occurred_on' => $issuedOn]);

        $payment = $invoice->payments()->sole();
        $payment->update(['amount_cents' => $payment->amount_cents->subtract(new Money(60_000, 'EUR'))]);
    }

    /** A quote each quarter for the platform's next features: most accepted, some refused, the last still open. */
    private function seedQuotes(User $user, Client $client, Mission $mission, CarbonImmutable $firstMonth, CarbonImmutable $lastMonth): void
    {
        $settings = $user->settingsOrFail();
        $quarter = 0;

        for ($issuedOn = $firstMonth->addDays(9); $issuedOn->lessThanOrEqualTo($lastMonth->endOfMonth()); $issuedOn = $issuedOn->addMonths(3)) {
            $days = 4 + $quarter % 5;
            $isLast = $issuedOn->addMonths(3)->greaterThan($lastMonth->endOfMonth());
            // The newest quote is still within its validity: the « awaiting answer » pile has one.
            $issuedOn = $isLast ? CarbonImmutable::today()->subDays(10) : $issuedOn;
            $status = match (true) {
                $isLast => QuoteStatus::Sent,
                $quarter % 4 === 3 => QuoteStatus::Refused,
                default => QuoteStatus::Accepted,
            };

            $quote = Quote::factory()->for($client, 'client')->create([
                'user_id' => $user->id,
                'mission_id' => $mission->id,
                'status' => $status,
                'source' => InvoiceSource::Opusline,
                'title' => 'Évolutions de la plateforme · lot '.($quarter + 1),
                'language' => DocumentLanguage::French,
                'issued_on' => $issuedOn,
                'valid_until' => $issuedOn->addDays(30),
                'accepted_on' => $status === QuoteStatus::Accepted ? $issuedOn->addDays(6) : null,
                'refused_on' => $status === QuoteStatus::Refused ? $issuedOn->addDays(12) : null,
                'show_email' => true,
                'seller_snapshot' => DocumentParties::seller($settings, false, true),
                'buyer_snapshot' => DocumentParties::buyer($client),
                'amount_ht_cents' => $days * 50_000,
                'amount_ttc_cents' => $days * 60_000,
            ]);
            $quote->lines()->create([
                'position' => 0,
                'label' => 'Développement des évolutions',
                'quantity_milli' => $days * 1_000,
                'unit' => LineUnit::Day,
                'currency' => 'EUR',
                'unit_price_cents' => 50_000,
                'vat_rate_bp' => 2_000,
                'total_ht_cents' => $days * 50_000,
            ]);
            DocumentEmail::factory()->create([
                'user_id' => $user->id,
                'quote_id' => $quote->id,
                'kind' => EmailTemplateKind::NewQuote,
                'recipients' => [$client->billing_email],
                'subject' => 'Devis des évolutions',
                'body' => "Bonjour Ingrid,\n\nVoici le devis du lot.\n\nBonne journée,",
                'sent_at' => $issuedOn,
            ]);
            $quarter++;
        }
    }

    /** Quotes and credit notes take one continuous series per year, in issue order, like the invoices. */
    private function numberDocuments(User $user): void
    {
        foreach ([[$user->quotes(), 'D'], [$user->creditNotes(), 'A']] as [$documents, $prefix]) {
            $countByYear = [];

            foreach ($documents->orderBy('issued_on')->orderBy('id')->get() as $document) {
                $year = $document->issued_on->year;
                $countByYear[$year] = ($countByYear[$year] ?? 0) + 1;
                $document->update(['number' => sprintf('%s-%d-%03d', $prefix, $year, $countByYear[$year])]);
            }
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

        foreach ($this->paidIn($user, $month) as $payment) {
            $lines[] = [$payment->paid_on, 'VIR SEPA '.Str::upper(Str::ascii($payment->invoice->client->name)), (int) $payment->amount_cents->getAmount()];
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

        foreach ($this->paidIn($user, $returnMonth) as $payment) {
            $htCents += (int) $payment->htShare()->getAmount();
            $vatCents += (int) $payment->vatShare()->getAmount();
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

    /** @return Collection<int, InvoicePayment> */
    private function paidIn(User $user, CarbonImmutable $month): Collection
    {
        return $user->invoicePayments()
            ->with('invoice.client')
            ->whereBetween('paid_on', [$month->toDateString(), $month->endOfMonth()->toDateString()])
            ->get();
    }
}
