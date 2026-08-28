<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMatchFactory;
use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Bank\Factories\BankStatementFactory;
use App\Domain\Bank\Factories\PersonalTransferFactory;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Factories\CraFactory;
use App\Domain\Cra\Models\Cra;
use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\TimeEntries\Factories\TimeEntryFactory;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Factories\RunningTimerFactory;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

pest()->printer()->compact();

/**
 * Whether the rule rejected the value.
 *
 * Lives here rather than beside the validation tests because two test files
 * share it, and under `--parallel` each worker only loads the files it runs.
 */
function rejects(ValidationRule $rule, mixed $value): bool
{
    $rejected = false;

    $rule->validate('identifier', $value, function () use (&$rejected): void {
        $rejected = true;
    });

    return $rejected;
}

/** The message the rule failed with, or null when it accepted the value. */
function failureMessage(ValidationRule $rule, mixed $value): ?string
{
    $message = null;

    $rule->validate('identifier', $value, function (string $failure) use (&$message): void {
        $message = $failure;
    });

    return $message;
}

/**
 * The shape mon-entreprise really returns: a rate as a percentage, and the
 * versement libératoire as an amount for the probe revenue (220 € on 10 000 €).
 */
function fakeBareme(float $ratePercent = 25.6, float $liberatingAmount = 220): void
{
    Http::fake([
        '*/evaluate' => Http::response([
            'evaluate' => [
                ['nodeValue' => $ratePercent, 'unit' => ['numerators' => ['%']]],
                ['nodeValue' => $liberatingAmount, 'unit' => ['numerators' => ['€'], 'denominators' => ['an']]],
            ],
        ]),
    ]);
}

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function settingsPayload(array $overrides = []): array
{
    return array_merge([
        'businessCountry' => 'FR',
        'locale' => Locale::fr_FR->value,
        'dateFormat' => DateFormat::DayMonthYear->value,
        'timezone' => 'Europe/Paris',
        'workdayMinutes' => 420,
        'urssafPeriodicity' => UrssafPeriodicity::Monthly->value,
        'autoRates' => false,
        'acre' => false,
        'contributionRateBp' => 2600,
        'liberatingPayment' => false,
        'liberatingPaymentRateBp' => 220,
        'vatRegime' => VatRegime::FranchiseEnBase->value,
        'defaultVatRateBp' => 2000,
        'defaultPaymentTermsDays' => 45,
        'invoiceNumberFormat' => 'AAAA-NNN',
        'homeAddressSameAsCompany' => true,
    ], $overrides);
}

/**
 * Freeze the clock at noon UTC, where the account's date (Europe/Paris by
 * default) and UTC's agree: near midnight they differ, and "today" assertions
 * would flip depending on the hour the suite runs.
 */
/** A debit with the fisc's own wording on it, for the detection paths. */
function fiscDebitOn(User $user, string $bookedOn, int $cents, string $label): void
{
    bankMovementFor($user, configure: fn (BankMovementFactory $factory) => $factory
        ->debit($cents)
        ->on($bookedOn)
        ->state(['label' => $label]));
}

function freezeTodayAtUtcNoon(): void
{
    test()->travelTo(CarbonImmutable::parse('2026-08-13 12:00:00', 'UTC'));
}

function fromSpa(): TestCase
{
    return test()->withHeader('Referer', 'http://localhost:3000');
}

/**
 * A document filed on a client, uploaded through the endpoint so it goes through
 * the same naming and category defaults the app applies.
 */
function uploadClientDocument(User $user, Client $client, string $fileName): int
{
    return test()->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create($fileName, 100, 'application/pdf'),
    ])->json('id');
}

/** A document filed on a mission, uploaded the same way. */
function uploadMissionDocument(User $user, Client $client, Mission $mission, string $fileName): int
{
    return test()->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create($fileName, 100, 'application/pdf'),
    ])->json('id');
}

/** An administrative piece filed on the user, uploaded the same way. */
function uploadUserDocument(User $user, string $fileName, ?int $category = null): int
{
    return test()->actingAs($user)->post('/api/user/documents', array_filter([
        'file' => UploadedFile::fake()->create($fileName, 100, 'application/pdf'),
        'category' => $category,
    ], static fn (mixed $value): bool => $value !== null))->json('id');
}

/** The raw bytes of a bank-statement fixture file. */
function bankFixture(string $name): string
{
    return (string) file_get_contents(__DIR__.'/Fixtures/Bank/'.$name);
}

/**
 * A bank statement imported by the given user.
 *
 * @param  (callable(BankStatementFactory): BankStatementFactory)|null  $configure
 */
function bankStatementOwnedBy(User $user, ?callable $configure = null): BankStatement
{
    return configuredFactory(BankStatement::factory(), $configure)->create(['user_id' => $user->id]);
}

/**
 * A bank movement of the given user, on a statement of theirs.
 *
 * @param  (callable(BankMovementFactory): BankMovementFactory)|null  $configure
 */
function bankMovementFor(User $user, ?BankStatement $statement = null, ?callable $configure = null): BankMovement
{
    $factory = BankMovement::factory()->for($statement ?? bankStatementOwnedBy($user), 'statement');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}

/**
 * An invoice of the given user, collected on $paidOn — the arrangement every
 * cash-basis assertion (provisions, treasury) starts from.
 */
function paidInvoiceOn(User $user, string $paidOn, int $htCents = 165_000, int $ttcCents = 198_000): void
{
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->paid()->state([
        'issued_on' => '2026-01-05',
        'due_on' => '2026-02-05',
        'paid_on' => $paidOn,
        'currency' => 'EUR',
        'amount_ht_cents' => $htCents,
        'amount_ttc_cents' => $ttcCents,
    ]));
}

/**
 * An account whose pro balance was last confirmed by hand on $recordedOn, with
 * no provisions of its own — established abroad, no matelas — so a treasury
 * assertion reads the transfer arithmetic and nothing else.
 */
function accountWithBankBalance(string $recordedOn = '2026-08-10', int $cents = 1_000_000): User
{
    $user = User::factory()->create();

    $user->settings()->sole()->update([
        'business_country' => 'DE',
        'currency' => 'EUR',
        'treasury_buffer_cents' => null,
        'bank_balance_cents' => $cents,
        'bank_balance_recorded_on' => $recordedOn,
    ]);

    return $user;
}

/**
 * A transfer the given user recorded towards their personal account.
 *
 * @param  (callable(PersonalTransferFactory): PersonalTransferFactory)|null  $configure
 */
function personalTransferFor(User $user, ?callable $configure = null): PersonalTransfer
{
    return configuredFactory(PersonalTransfer::factory(), $configure)->create(['user_id' => $user->id]);
}

/**
 * A reconciliation suggestion of the given user, pairing a movement and an
 * invoice of theirs.
 *
 * @param  (callable(BankMatchFactory): BankMatchFactory)|null  $configure
 */
function bankMatchFor(User $user, ?Invoice $invoice = null, ?BankMovement $movement = null, ?callable $configure = null): BankMatch
{
    $factory = BankMatch::factory()
        ->for($movement ?? bankMovementFor($user), 'movement')
        ->for($invoice ?? invoiceOwnedBy($user, configure: fn (InvoiceFactory $invoiceFactory): InvoiceFactory => $invoiceFactory->sent()), 'invoice');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}

/**
 * Apply a test's optional factory tweak, or hand the factory back untouched.
 *
 * @template TFactory of Factory
 *
 * @param  TFactory  $factory
 * @param  (callable(TFactory): TFactory)|null  $configure
 * @return TFactory
 */
function configuredFactory(Factory $factory, ?callable $configure): Factory
{
    return $configure === null ? $factory : $configure($factory);
}

/**
 * A mission owned by the given user, through a client of that user.
 *
 * Ownership runs user → client → mission, so arranging one mission means
 * arranging all three. $configure receives the mission factory for states
 * such as hourly() or fixed().
 *
 * @param  (callable(MissionFactory): MissionFactory)|null  $configure
 */
function missionOwnedBy(User $user, ?callable $configure = null): Mission
{
    $factory = Mission::factory()->for(Client::factory()->for($user)->create(), 'client');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}

/**
 * A forfait priced at $forfaitCents with a reference TJM of $referenceCents, carrying
 * $days full workdays of tracked time — enough to read a budget off.
 *
 * Lives here rather than beside one test file because two share it, and under
 * `--parallel` each worker only loads the files it runs.
 */
function forfaitWith(User $user, int $forfaitCents, int $referenceCents, int $days, ?Client $client = null, ?string $name = null): Mission
{
    $mission = Mission::factory()
        ->for($client ?? Client::factory()->for($user)->create(), 'client')
        ->fixed()
        ->withReferenceDailyRate($referenceCents)
        ->create(array_filter([
            'user_id' => $user->id,
            'rate_cents' => $forfaitCents,
            'name' => $name,
        ], static fn (mixed $value): bool => $value !== null));

    $day = CarbonImmutable::parse('2026-08-01');

    for ($tracked = 0; $tracked < $days; $tracked++) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'date' => $day->addDays($tracked)->toDateString(),
        ]);
    }

    return $mission;
}

/**
 * Put the account on a TVA-liable regime. Settings default to the franchise en
 * base, where the effective rate is 0 and every invoice is net-equals-gross.
 */
function vatLiable(User $user, int $rateBp = 2000): void
{
    $user->settings()->sole()->update([
        'vat_regime' => VatRegime::ReelNormal,
        'default_vat_rate_bp' => $rateBp,
    ]);
}

/**
 * An invoice owned by the given user, filed under a client of theirs.
 *
 * Ownership runs user → client → invoice. Pass $client when the test asserts
 * against it, and $configure for factory states such as sent() or overdue().
 *
 * @param  (callable(InvoiceFactory): InvoiceFactory)|null  $configure
 */
function invoiceOwnedBy(User $user, ?Client $client = null, ?callable $configure = null): Invoice
{
    $factory = Invoice::factory()->for($client ?? Client::factory()->for($user)->create(), 'client');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}

/**
 * An invoice of the given user, filed under the client of the given mission and
 * billing that mission.
 *
 * @param  (callable(InvoiceFactory): InvoiceFactory)|null  $configure
 */
function invoiceForMission(User $user, Mission $mission, ?callable $configure = null): Invoice
{
    return invoiceOwnedBy($user, $mission->client, function (InvoiceFactory $factory) use ($mission, $configure): InvoiceFactory {
        $factory = $factory->state(['mission_id' => $mission->id]);

        return configuredFactory($factory, $configure);
    });
}

/**
 * A time entry on the given mission that the given invoice bills.
 */
function invoicedTimeEntry(User $user, Mission $mission, Invoice $invoice): TimeEntry
{
    return TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'invoice_id' => $invoice->id,
    ]);
}

/**
 * A CRA of the given user, on a mission of theirs.
 *
 * Pass $mission when the test asserts against it, and $configure for factory states
 * such as sent() or forMonth().
 *
 * @param  (callable(CraFactory): CraFactory)|null  $configure
 */
function craOwnedBy(User $user, ?Mission $mission = null, ?callable $configure = null): Cra
{
    $factory = Cra::factory()->for($mission ?? craMissionOwnedBy($user), 'mission');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}

/**
 * A mission of the given user whose client expects a monthly CRA — the arrangement
 * every CRA test starts from.
 *
 * @param  (callable(MissionFactory): MissionFactory)|null  $configure
 */
function craMissionOwnedBy(User $user, ?callable $configure = null): Mission
{
    return missionOwnedBy(
        $user,
        fn (MissionFactory $factory): MissionFactory => configuredFactory($factory->requiringCra(), $configure),
    );
}

/**
 * Days worked on a CRA, given as `Y-m-d` => basis points of a workday.
 *
 * @param  array<string, int>  $days
 */
function craDays(Cra $cra, array $days): Cra
{
    foreach ($days as $date => $basisPoints) {
        $cra->days()->create(['date' => $date, 'day_fraction_bp' => $basisPoints]);
    }

    return $cra->load('days');
}

/**
 * A day of tracked time on a mission, defaulting to a full workday.
 *
 * @param  (callable(TimeEntryFactory): TimeEntryFactory)|null  $configure
 */
function trackedDay(User $user, Mission $mission, string $date, int $minutes = 420, ?callable $configure = null): TimeEntry
{
    $factory = TimeEntry::factory()->for($mission, 'mission');

    return configuredFactory($factory, $configure)->create([
        'user_id' => $user->id,
        'date' => $date,
        'duration_minutes' => $minutes,
    ]);
}

/**
 * The running timer of the given user, on a mission of theirs.
 *
 * Pass $mission when the test asserts against it, and $configure for factory
 * states such as paused().
 *
 * @param  (callable(RunningTimerFactory): RunningTimerFactory)|null  $configure
 */
function runningTimerFor(User $user, ?Mission $mission = null, ?callable $configure = null): RunningTimer
{
    $factory = RunningTimer::factory()->for($mission ?? missionOwnedBy($user), 'mission');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}
