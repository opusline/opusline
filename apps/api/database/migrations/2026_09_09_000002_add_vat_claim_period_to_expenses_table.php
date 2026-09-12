<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The CA3 month the recoverable TVA is claimed on — the month of the
        // purchase unless it was deferred, or the purchase reached an already
        // declared month. Added nullable, filled, then pinned, so the column
        // can land on rows that predate it.
        Schema::table('expenses', function (Blueprint $table): void {
            $table->char('vat_claim_period', 7)->nullable()->after('spent_on');
        });

        DB::table('expenses')->orderBy('id')->chunkById(500, function ($expenses): void {
            foreach ($expenses as $expense) {
                $spentOn = $expense->spent_on;
                assert(is_string($spentOn));

                DB::table('expenses')
                    ->where('id', $expense->id)
                    ->update(['vat_claim_period' => substr($spentOn, 0, 7)]);
            }
        });

        Schema::table('expenses', function (Blueprint $table): void {
            $table->char('vat_claim_period', 7)->nullable(false)->change();
            $table->index(['user_id', 'vat_claim_period']);
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'vat_claim_period']);
            $table->dropColumn('vat_claim_period');
        });
    }
};
