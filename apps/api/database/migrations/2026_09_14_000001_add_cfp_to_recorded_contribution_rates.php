<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The CFP joins the effective contribution rate in this release, and the
 * provisions price every past period with the rate history as recorded. The
 * rows written before it were taken without the CFP, so they would price those
 * periods 0,2 point short: they get it added once, at the rate in force when
 * they were written rather than whatever the config says later.
 */
return new class extends Migration
{
    private const int CFP_RATE_BP = 20;

    public function up(): void
    {
        DB::table('contribution_rates')->increment('effective_rate_bp', self::CFP_RATE_BP);
    }

    public function down(): void
    {
        DB::table('contribution_rates')->decrement('effective_rate_bp', self::CFP_RATE_BP);
    }
};
