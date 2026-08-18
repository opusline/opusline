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
        Schema::table('missions', function (Blueprint $table): void {
            // Your usual day rate, so a fixed price can be read as an effort
            // budget: a 8 000 € forfait at a 550 €/j target buys about 14,5 days.
            // Only a forfait has one — every other mode already bills a rate.
            $table->unsignedBigInteger('target_rate_cents')->nullable()->after('rate_cents');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('missions', function (Blueprint $table): void {
            $table->dropColumn('target_rate_cents');
        });
    }
};
