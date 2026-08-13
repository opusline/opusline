<?php

declare(strict_types=1);

use App\Domain\Settings\Rates\RateSituation;
use Carbon\CarbonImmutable;

/**
 * @return array<string, string>
 */
function situation(bool $acre = false, ?string $startedOn = null): array
{
    return (new RateSituation(
        acre: $acre,
        businessStartedOn: $startedOn === null ? null : CarbonImmutable::parse($startedOn),
    ))->toArray();
}

test('describes an auto-entrepreneur in a non-regulated liberal profession', function (): void {
    expect(situation())
        ->toMatchArray([
            'entreprise . catégorie juridique' => "'EI'",
            'entreprise . catégorie juridique . EI . auto-entrepreneur' => 'oui',
            'entreprise . activité . nature' => "'libérale'",
            'entreprise . activité . nature . libérale . réglementée' => 'non',
        ]);
});

test('pins the metropolitan barème, since the DROM one differs', function (): void {
    expect(situation())->toHaveKey('établissement . commune . département . outre-mer', 'non');
});

test('sends the creation date in the format the engine parses', function (): void {
    expect(situation(startedOn: '2026-03-01'))
        ->toHaveKey('entreprise . date de création', '01/03/2026');
});

test('falls back to a distant creation date rather than today', function (): void {
    // Assuming "today" would hand the reduced ACRE rate to someone who has been
    // trading for years — the safe default is the one that costs nothing.
    expect(situation()['entreprise . date de création'])->toBe('01/01/2000');
});

test('reports whether ACRE applies', function (bool $acre, string $expected): void {
    expect(situation(acre: $acre))->toHaveKey('dirigeant . exonérations . ACRE', $expected);
})->with([
    'under ACRE' => [true, 'oui'],
    'not under ACRE' => [false, 'non'],
]);

test('gives situations that differ a different cache signature', function (): void {
    $standard = new RateSituation(false, CarbonImmutable::parse('2020-01-01'));
    $withAcre = new RateSituation(true, CarbonImmutable::parse('2020-01-01'));
    $laterAcre = new RateSituation(true, CarbonImmutable::parse('2026-01-01'));

    expect($standard->signature())
        ->not->toBe($withAcre->signature())
        ->and($withAcre->signature())->not->toBe($laterAcre->signature());
});

test('shares one signature across start dates when no ACRE is claimed', function (): void {
    // The engine only reads the creation date to age the ACRE exoneration, so
    // keying on it otherwise would give every account its own call to URSSAF.
    $standard = new RateSituation(false, CarbonImmutable::parse('2020-01-01'));
    $newer = new RateSituation(false, CarbonImmutable::parse('2026-01-01'));

    expect($standard->signature())->toBe($newer->signature());
});

test('gives identical situations the same signature, so two accounts share one call', function (): void {
    $one = new RateSituation(false, CarbonImmutable::parse('2020-01-01'));
    $two = new RateSituation(false, CarbonImmutable::parse('2020-01-01'));

    expect($one->signature())->toBe($two->signature());
});
