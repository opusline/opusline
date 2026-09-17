<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

/*
 * Temporary safety net for #348: every fiscal figure the API serves, pinned
 * while the rules move into app/Domain/Fiscality. The snapshots must stay
 * byte-identical across that move; the rung that fences the domain deletes
 * this file.
 */

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    Http::preventStrayRequests();
    Storage::fake('local');
});

test('serves the same fiscal figures for a fiscal profile', function (string $profile): void {
    $user = match ($profile) {
        'franchise monthly' => goldenFranchiseMonthlyAccount(),
        'reel normal quarterly with acre' => goldenReelNormalQuarterlyAccount(),
        'reel simplifie established' => goldenReelSimplifieAccount(),
        'established abroad' => goldenAbroadAccount(),
    };

    expect(goldenFigures($user))->toMatchSnapshot();
})->with([
    'franchise monthly',
    'reel normal quarterly with acre',
    'reel simplifie established',
    'established abroad',
]);

function goldenFranchiseMonthlyAccount(): User
{
    $user = goldenUser('franchise');
    $user->settings()->sole()->update([
        'auto_rates' => false,
        'business_started_on' => '2025-03-01',
        'urssaf_periodicity' => UrssafPeriodicity::Monthly,
        'contribution_rate_bp' => 2_460,
        'liberating_payment' => false,
        'liberating_payment_rate_bp' => 220,
        'bank_balance_cents' => 1_234_500,
        'bank_balance_recorded_on' => '2026-08-10',
    ]);

    goldenPaidInvoice($user, 'Nordlys', '2026-001', '2026-06-30', 12_345, 12_345);
    goldenPaidInvoice($user, 'Callisto', '2026-002', '2026-07-15', 480_000, 480_000);
    invoiceOwnedBy($user, goldenClient($user, 'Vesterhus Design'), fn (InvoiceFactory $factory): InvoiceFactory => $factory->sent()->state([
        'number' => '2026-012',
        'issued_on' => '2026-08-03',
        'due_on' => '2026-09-17',
        'currency' => 'EUR',
        'amount_ht_cents' => 90_000,
        'amount_ttc_cents' => 90_000,
    ]));
    fiscDebitOn($user, '2025-12-15', 48_000, 'PRLV CFE 2025 SIE PARIS');
    fiscDebitOn($user, '2026-07-28', 30_000, 'PRLV URSSAF JUIN');
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-10')->ttc(12_000));

    return $user;
}

function goldenReelNormalQuarterlyAccount(): User
{
    $user = goldenUser('reel-normal');
    $user->settings()->sole()->update([
        'auto_rates' => false,
        'business_started_on' => '2026-02-10',
        'urssaf_periodicity' => UrssafPeriodicity::Quarterly,
        'acre' => true,
        'contribution_rate_bp' => 1_230,
        'liberating_payment' => true,
        'liberating_payment_rate_bp' => 220,
        'vat_regime' => VatRegime::ReelNormal,
        'default_vat_rate_bp' => 2_000,
        'cfe_expected_cents' => 350_000,
        'treasury_buffer_cents' => 300_000,
        'bank_balance_cents' => 2_500_000,
        'bank_balance_recorded_on' => '2026-08-12',
    ]);

    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 2_470, 'effective_from' => '2026-02-10']);
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 1_470, 'effective_from' => '2026-05-01']);

    goldenPaidInvoice($user, 'Lunaprint', '2026-003', '2026-03-20', 330_000, 396_000);
    goldenPaidInvoice($user, 'Orvella', '2026-004', '2026-05-12', 412_500, 495_000);
    goldenPaidInvoice($user, 'Vesterhus', '2026-005', '2026-07-31', 165_000, 198_000);
    invoiceOwnedBy($user, goldenClient($user, 'Studio Lorem Ipsum'), fn (InvoiceFactory $factory): InvoiceFactory => $factory->overdue()->state([
        'number' => '2026-013',
        'issued_on' => '2026-06-01',
        'due_on' => '2026-07-01',
        'currency' => 'EUR',
        'amount_ht_cents' => 220_000,
        'amount_ttc_cents' => 264_000,
    ]));

    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-06-14')->ttc(144_000));
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-02')->reverseCharged(50_000, ExpenseVatTreatment::ReverseChargeNonEu));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-21')->ttc(3_600));

    ca3DeclaredFor($user, '2026-06', '2026-07-19');
    fiscDebitOn($user, '2026-07-24', 58_000, 'PRLV SEPA DGFIP TVA 2026-06');
    fiscDebitOn($user, '2026-08-05', 49_500, 'PRLV URSSAF T2 2026');
    personalTransferFor($user);

    return $user;
}

function goldenReelSimplifieAccount(): User
{
    $user = goldenUser('reel-simplifie');
    $user->settings()->sole()->update([
        'auto_rates' => false,
        'business_started_on' => '2024-05-01',
        'urssaf_periodicity' => UrssafPeriodicity::Monthly,
        'contribution_rate_bp' => 2_560,
        'liberating_payment' => true,
        'liberating_payment_rate_bp' => 220,
        'vat_regime' => VatRegime::ReelSimplifie,
        'default_vat_rate_bp' => 1_000,
    ]);

    goldenPaidInvoice($user, 'Studio Lorem', '2026-006', '2025-04-18', 1_800_000, 1_980_000);
    goldenPaidInvoice($user, 'Ateliers Ruche', '2026-007', '2025-11-03', 2_450_000, 2_695_000);
    goldenPaidInvoice($user, 'Nordlys Cloud', '2026-008', '2026-02-27', 960_000, 1_056_000);
    goldenPaidInvoice($user, 'Callisto Media', '2026-009', '2026-08-07', 540_000, 594_000);
    fiscDebitOn($user, '2025-12-15', 112_000, 'IMPOT CFE 2025');
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2025-09-09')->exempt(45_000));

    return $user;
}

function goldenAbroadAccount(): User
{
    $user = goldenUser('abroad');
    $user->settings()->sole()->update([
        'auto_rates' => false,
        'business_country' => 'BE',
        'business_started_on' => '2023-09-01',
        'vat_regime' => VatRegime::ReelNormal,
        'default_vat_rate_bp' => 2_100,
        'bank_balance_cents' => 800_000,
        'bank_balance_recorded_on' => '2026-08-01',
    ]);

    goldenPaidInvoice($user, 'Lunaprint Atelier', '2026-010', '2026-04-30', 700_000, 847_000);
    goldenPaidInvoice($user, 'Orvella Conseil', '2026-011', '2026-07-31', 350_000, 423_500);
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-18')->ttc(24_200, 2_100));

    return $user;
}

function goldenUser(string $profile): User
{
    return User::factory()->create(['name' => 'Camille Vesterhus', 'email' => "{$profile}@opusline.test"]);
}

function goldenClient(User $user, string $name): Client
{
    return Client::factory()->for($user)->create(['name' => $name]);
}

/** paidInvoiceOn(), with the client and number faker would otherwise pick — they order the lists. */
function goldenPaidInvoice(User $user, string $clientName, string $number, string $paidOn, int $htCents, int $ttcCents): void
{
    invoiceOwnedBy($user, goldenClient($user, $clientName), fn (InvoiceFactory $factory): InvoiceFactory => $factory->paid()->state([
        'number' => $number,
        'issued_on' => '2026-01-05',
        'due_on' => '2026-02-05',
        'paid_on' => $paidOn,
        'currency' => 'EUR',
        'amount_ht_cents' => $htCents,
        'amount_ttc_cents' => $ttcCents,
    ]));
}

/**
 * Every fiscal read the SPA makes, then a settings save and the reads it
 * rewrites — each scrubbed of what the database decides (ids, tokens,
 * timestamps) and paired with the queries it ran.
 *
 * @return array<string, mixed>
 */
function goldenFigures(User $user): array
{
    $reads = [
        '/api/user',
        '/api/settings',
        '/api/declarations',
        '/api/declarations?period=2026-03',
        '/api/declarations?period=2026-06',
        '/api/declarations?period=2025-12',
        '/api/deadlines',
        '/api/treasury',
        '/api/bank',
        '/api/revenue',
        '/api/revenue?period=2025',
        '/api/client-revenue',
        '/api/invoices/summary',
        '/api/invoices/summary?month=2026-07',
        '/api/expenses',
        '/api/expenses?month=2026-07',
    ];

    $figures = [];

    foreach ($reads as $path) {
        $figures[$path] = goldenRead($user, $path);
    }

    $calendarToken = test()->actingAs($user)->getJson('/api/deadlines')->json('calendarToken');
    $feed = (string) test()->get("/api/calendar/{$calendarToken}.ics")->content();
    // DTSTAMP is written from the wall clock, which travelTo() does not reach.
    $figures['calendar feed'] = preg_replace(
        ['/^DTSTAMP:[^\r\n]+/m', "/opusline-{$user->getKey()}-/", '/-inv-\d+/'],
        ['DTSTAMP:[scrubbed]', 'opusline-[user]-', '-inv-[invoice]'],
        $feed,
    );

    test()->actingAs($user)->postJson('/api/deadlines/reminders/read')->assertOk();

    $settings = $user->settingsOrFail();
    $save = test()->actingAs($user->fresh())->putJson('/api/settings', settingsPayload([
        'businessCountry' => $settings->business_country,
        'businessStartedOn' => $settings->business_started_on?->toDateString(),
        'urssafPeriodicity' => $settings->urssaf_periodicity === UrssafPeriodicity::Monthly
            ? UrssafPeriodicity::Quarterly->value
            : UrssafPeriodicity::Monthly->value,
        'acre' => $settings->acre,
        'contributionRateBp' => $settings->contribution_rate_bp - 100,
        'liberatingPayment' => $settings->liberating_payment,
        'liberatingPaymentRateBp' => $settings->liberating_payment_rate_bp,
        'vatRegime' => $settings->vat_regime->value,
        'defaultVatRateBp' => $settings->default_vat_rate_bp,
    ]));

    $figures['settings save'] = ['status' => $save->status(), 'body' => goldenScrub($save->json())];
    $figures['recorded contribution rates'] = ContributionRate::query()
        ->where('user_id', $user->id)
        ->orderBy('effective_from')
        ->get(['effective_rate_bp', 'effective_from'])
        ->map(fn (ContributionRate $rate): array => [
            'effectiveRateBp' => $rate->effective_rate_bp,
            'effectiveFrom' => $rate->effective_from->toDateString(),
        ])
        ->all();
    $figures['reminders read after save'] = $user->fresh()?->settingsOrFail()->deadline_reminders_read_at?->toIso8601String();

    foreach (['/api/user', '/api/declarations', '/api/deadlines', '/api/treasury'] as $path) {
        $figures["{$path} after save"] = goldenRead($user, $path);
    }

    return $figures;
}

/** @return array{status: int, queries: int, body: mixed} */
function goldenRead(User $user, string $path): array
{
    $fresh = $user->fresh() ?? $user;

    DB::flushQueryLog();
    DB::enableQueryLog();
    $response = test()->actingAs($fresh)->getJson($path);
    $queries = count(DB::getQueryLog());
    DB::disableQueryLog();

    return ['status' => $response->status(), 'queries' => $queries, 'body' => goldenScrub($response->json())];
}

function goldenScrub(mixed $value, string $key = ''): mixed
{
    if (preg_match('/^(id|\w+Id|\w+Ids|token|\w+Token|url|\w+Url|createdAt|updatedAt)$/', $key) === 1) {
        return '[scrubbed]';
    }

    if (! is_array($value)) {
        return $value;
    }

    $scrubbed = [];

    foreach ($value as $childKey => $child) {
        $scrubbed[$childKey] = goldenScrub($child, (string) $childKey);
    }

    return $scrubbed;
}
