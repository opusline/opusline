<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fiscal_deadline_completions', function (Blueprint $table): void {
            // The day the return was paid, when the account records it apart
            // from filing: URSSAF télépaie a month later, the CA3 the same day.
            $table->date('paid_on')->nullable()->after('completed_on');
        });
    }

    public function down(): void
    {
        Schema::table('fiscal_deadline_completions', function (Blueprint $table): void {
            $table->dropColumn('paid_on');
        });
    }
};
