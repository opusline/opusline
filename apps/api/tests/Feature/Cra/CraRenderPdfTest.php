<?php

declare(strict_types=1);

use App\Domain\Cra\Actions\RenderCraPdf;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;

test('renders a PDF for a month of reported days', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000, '2026-07-07' => 5_000],
    );

    $pdf = app(RenderCraPdf::class)->handle($cra);

    expect($pdf)->toStartWith('%PDF-')
        ->and(strlen($pdf))->toBeGreaterThan(1_000);
});

test('embeds the bundled fonts rather than falling back to a built-in one', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    // dompdf's chroot defaults to its own package directory and rejects everything
    // outside it silently: a misconfigured chroot drops every @font-face src and the
    // document renders in Helvetica, which no assertion on "%PDF-" would ever catch.
    expect(app(RenderCraPdf::class)->handle($cra))
        ->toContain('Geist')
        ->toContain('Lora');
});

test('prints the rate of a fixed-price mission rather than a dash', function (): void {
    $user = User::factory()->create();
    // A Fixed mission passes usesDayFraction(), so it can require a CRA — but its
    // dailyRate() is null, which used to print "—" on paper while the screen showed
    // the real figure through formatMissionRate().
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Fixed,
        'rate_cents' => 1_500_00,
    ]));
    $cra = craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07'));

    expect(app(RenderCraPdf::class)->viewData($cra)['rateLabel'])->toBe('1 500 € forfait');
});

test('keeps the cents of a rate that is not a whole number of euros', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rate_cents' => 550_50,
    ]));
    $cra = craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07'));

    // Rounding to whole euros printed 551 on paper while the screen showed 550,5.
    expect(app(RenderCraPdf::class)->viewData($cra)['rateLabel'])->toBe('550,5 € / jour');
});

test('names the file after the mission and the month', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07'));

    expect(app(RenderCraPdf::class)->fileName($cra))->toBe("CRA-{$mission->slug}-2026-07.pdf");
});

test('renders a month with no reported day at all', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07'));

    expect(app(RenderCraPdf::class)->handle($cra))->toStartWith('%PDF-');
});

test('leaves the signature off unless it is asked for', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );
    $user->addMedia(UploadedFile::fake()->image('signature.png', 300, 120))
        ->preservingOriginal()
        ->toMediaCollection('signature', 'local');

    $without = app(RenderCraPdf::class)->handle($cra);
    $with = app(RenderCraPdf::class)->handle($cra, applySignature: true);

    // The image only rides along when the toggle asks for it, so the two documents
    // differ in size rather than in wording.
    expect(strlen($with))->toBeGreaterThan(strlen($without));
});

test('renders a month that starts on a Sunday, so the grid spills a week', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        // 1 November 2026 is a Sunday, and it is also Toussaint.
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-11')),
        ['2026-11-02' => 10_000, '2026-11-30' => 10_000],
    );

    expect(app(RenderCraPdf::class)->handle($cra))->toStartWith('%PDF-');
});
