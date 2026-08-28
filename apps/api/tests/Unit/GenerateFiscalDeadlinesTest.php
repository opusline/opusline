<?php

declare(strict_types=1);

use App\Domain\Deadlines\Actions\GenerateFiscalDeadlines;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Enums\Currency;
use Carbon\CarbonImmutable;
use Tests\TestCase;

uses(TestCase::class);

/**
 * A fiscal profile with every deadline switched off, so each test turns on
 * exactly the one it is about.
 *
 * @param  array<string, mixed>  $overrides
 */
function fiscalProfile(array $overrides = []): UserSettings
{
    // Currency first: MoneyIntegerCast reads it when it writes an amount.
    return new UserSettings([
        'currency' => Currency::EUR->value,
        'business_country' => 'FR',
        'urssaf_periodicity' => UrssafPeriodicity::Monthly,
        'vat_regime' => VatRegime::FranchiseEnBase,
        'cfe_expected_cents' => null,
        'business_started_on' => null,
        ...$overrides,
    ]);
}

/**
 * @param  array<string, mixed>  $overrides
 * @return list<string>
 */
function dueDates(array $overrides, string $from, string $to, ?FiscalDeadlineKind $kind = null): array
{
    $profile = fiscalProfile($overrides);

    $deadlines = new GenerateFiscalDeadlines()->handle(
        $profile,
        CarbonImmutable::parse($from),
        CarbonImmutable::parse($to),
        $profile->cfe_expected_cents,
    );

    return array_values(array_map(
        static fn (FiscalDeadline $deadline): string => $deadline->dueOn->toDateString(),
        array_filter(
            $deadlines,
            static fn (FiscalDeadline $deadline): bool => ! $kind instanceof FiscalDeadlineKind || $deadline->kind === $kind,
        ),
    ));
}

test('a business established outside France has no French fiscal calendar', function (): void {
    expect(dueDates(
        ['business_country' => 'DE', 'cfe_expected_cents' => 48000, 'liberating_payment' => false],
        '2026-01-01',
        '2026-12-31',
    ))->toBe([]);
});

test('URSSAF is declared by the end of the month following each month', function (): void {
    expect(dueDates([], '2026-08-01', '2026-09-30', FiscalDeadlineKind::UrssafDeclaration))
        ->toBe(['2026-08-31', '2026-09-30']);
});

test('a URSSAF month-end landing on a weekend rolls to the next working day', function (): void {
    // 31 January and 28 February 2026 are both Saturdays; 31 March is a Tuesday.
    expect(dueDates([], '2026-02-01', '2026-03-31', FiscalDeadlineKind::UrssafDeclaration))
        ->toBe(['2026-02-02', '2026-03-02', '2026-03-31']);
});

test('URSSAF quarterly declares one month after each quarter', function (): void {
    expect(dueDates(
        ['urssaf_periodicity' => UrssafPeriodicity::Quarterly],
        '2026-01-01',
        '2026-12-31',
        FiscalDeadlineKind::UrssafDeclaration,
        // Q4 2025 rolls off 31 January, a Saturday; Q3 2026 rolls off 31 October, likewise.
    ))->toBe(['2026-02-02', '2026-04-30', '2026-07-31', '2026-11-02']);
});

test('URSSAF occurrences carry the period they declare, not the month they are paid', function (): void {
    $monthly = new GenerateFiscalDeadlines()->handle(
        fiscalProfile(),
        CarbonImmutable::parse('2026-08-01'),
        CarbonImmutable::parse('2026-08-31'),
    );

    expect($monthly[0]->periodKey)->toBe('2026-07')
        ->and($monthly[0]->periodStart->toDateString())->toBe('2026-07-01');

    $quarterly = new GenerateFiscalDeadlines()->handle(
        fiscalProfile(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]),
        CarbonImmutable::parse('2026-07-01'),
        CarbonImmutable::parse('2026-07-31'),
    );

    expect($quarterly[0]->periodKey)->toBe('2026-Q2')
        ->and($quarterly[0]->periodStart->toDateString())->toBe('2026-04-01');
});

test('the franchise en base owes no TVA declaration', function (): void {
    expect(dueDates([], '2026-01-01', '2026-12-31', FiscalDeadlineKind::VatCa3))->toBe([])
        ->and(dueDates([], '2026-01-01', '2027-12-31', FiscalDeadlineKind::VatCa12))->toBe([]);
});

test('the réel normal files a CA3 on the 15th of the following month', function (): void {
    // 15 August 2026 is both a Saturday and the Assomption, so it rolls.
    expect(dueDates(
        ['vat_regime' => VatRegime::ReelNormal],
        '2026-08-01',
        '2026-09-30',
        FiscalDeadlineKind::VatCa3,
    ))->toBe(['2026-08-17', '2026-09-15']);
});

test('the réel simplifié files one CA12 on the 2nd working day after 1 May', function (): void {
    expect(dueDates(
        ['vat_regime' => VatRegime::ReelSimplifie],
        '2026-01-01',
        '2027-12-31',
        FiscalDeadlineKind::VatCa12,
    ))->toBe(['2026-05-05', '2027-05-04']);
});

test('the CA12 declares the year that closed, not the year it is filed in', function (): void {
    $deadlines = new GenerateFiscalDeadlines()->handle(
        fiscalProfile(['vat_regime' => VatRegime::ReelSimplifie]),
        CarbonImmutable::parse('2027-05-01'),
        CarbonImmutable::parse('2027-05-31'),
    );

    expect($deadlines[0]->periodKey)->toBe('2026')
        ->and($deadlines[0]->periodStart->toDateString())->toBe('2026-01-01');
});

test('the CFE deadline stands whether or not an amount is known', function (): void {
    // The December date is statutory — hiding it until an amount is entered
    // would hide it exactly from the people who forgot it exists.
    expect(dueDates([], '2026-01-01', '2026-12-31', FiscalDeadlineKind::Cfe))->toBe(['2026-12-15'])
        ->and(dueDates(['cfe_expected_cents' => 48000], '2026-01-01', '2026-12-31', FiscalDeadlineKind::Cfe))
        ->toBe(['2026-12-15']);
});

test('a CFE over 3 000 € is halved into a June acompte and a December solde', function (): void {
    $overrides = ['cfe_expected_cents' => 400000];

    expect(dueDates($overrides, '2026-01-01', '2026-12-31', FiscalDeadlineKind::CfeInstalment))
        ->toBe(['2026-06-15'])
        ->and(dueDates($overrides, '2026-01-01', '2026-12-31', FiscalDeadlineKind::Cfe))
        ->toBe(['2026-12-15']);
});

test('without a figure there is no June acompte to threshold', function (): void {
    expect(dueDates([], '2026-01-01', '2026-12-31', FiscalDeadlineKind::CfeInstalment))->toBe([]);
});

test('a CFE of exactly 3 000 € is paid in one go', function (): void {
    expect(dueDates(['cfe_expected_cents' => 300000], '2026-01-01', '2026-12-31', FiscalDeadlineKind::CfeInstalment))
        ->toBe([]);
});

test('the creation year is exempt from CFE', function (): void {
    expect(dueDates(
        ['cfe_expected_cents' => 48000, 'business_started_on' => '2026-03-04'],
        '2026-01-01',
        '2027-12-31',
        FiscalDeadlineKind::Cfe,
    ))->toBe(['2027-12-15']);
});

test('a full profile comes back in due order', function (): void {
    $profile = fiscalProfile([
        'vat_regime' => VatRegime::ReelNormal,
        'cfe_expected_cents' => 48000,
    ]);

    $deadlines = new GenerateFiscalDeadlines()->handle(
        $profile,
        CarbonImmutable::parse('2026-11-01'),
        CarbonImmutable::parse('2026-12-31'),
        $profile->cfe_expected_cents,
    );

    expect(array_map(
        static fn (FiscalDeadline $deadline): string => "{$deadline->dueOn->toDateString()} {$deadline->kind->name}",
        $deadlines,
    ))->toBe([
        '2026-11-02 UrssafDeclaration',
        '2026-11-16 VatCa3',
        '2026-11-30 UrssafDeclaration',
        '2026-12-15 VatCa3',
        '2026-12-15 Cfe',
        '2026-12-31 UrssafDeclaration',
    ]);
});
