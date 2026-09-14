<?php

declare(strict_types=1);

use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;

function cfpMigration(): Migration
{
    return require database_path('migrations/2026_09_14_000001_add_cfp_to_recorded_contribution_rates.php');
}

test('adds the CFP to the rates recorded without it', function (): void {
    $user = User::factory()->create();
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 1230, 'effective_from' => '2025-01-01']);
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 2460, 'effective_from' => '2026-01-01']);

    cfpMigration()->up();

    expect(ContributionRate::query()->orderBy('effective_from')->pluck('effective_rate_bp')->all())->toBe([1250, 2480]);
});

test('takes the CFP back out on rollback', function (): void {
    $user = User::factory()->create();
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 2480, 'effective_from' => '2026-01-01']);

    cfpMigration()->down();

    expect(ContributionRate::query()->sole()->effective_rate_bp)->toBe(2460);
});
