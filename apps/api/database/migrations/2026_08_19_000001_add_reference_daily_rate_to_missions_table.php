<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('missions', function (Blueprint $table): void {
            // The « TJM de référence »: what a day of tracked time is worth when
            // reading a forfait's consumption. It prices nothing — rate_cents is
            // still the whole contract — and it never reaches an invoice.
            $table->unsignedBigInteger('reference_daily_rate_cents')
                ->nullable()
                ->after('rate_cents');
        });

        // Rounding used to be forbidden on a forfait, so existing ones carry null and
        // would fall back to the quarter-day default. A forfait now rounds like any
        // day-billed mission, and its budget is read through that increment, so they
        // are pinned to what a mission created today would get.
        DB::table('missions')
            ->where('billing_mode', BillingMode::Fixed->value)
            ->whereNull('rounding')
            ->update(['rounding' => EntryRounding::Half->value]);
    }

    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table): void {
            $table->dropColumn('reference_daily_rate_cents');
        });
    }
};
