<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            // The hand-typed balance anchor. Signed: overdrafts are a legal state.
            $table->bigInteger('bank_balance_cents')->nullable()->after('treasury_buffer_cents');
            $table->date('bank_balance_recorded_on')->nullable()->after('bank_balance_cents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['bank_balance_cents', 'bank_balance_recorded_on']);
        });
    }
};
