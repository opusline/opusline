<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The 2042-C PRO asks a whole past year whether the versement libératoire was
 * paid on its receipts, and the effective rate alone cannot answer: 25,2 %
 * looks the same whether the option was off or on at 0 %. Nullable, and left
 * null on the rows written before this release — a row that does not know is
 * not a row that says no.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contribution_rates', function (Blueprint $table): void {
            $table->boolean('liberating_payment')->nullable()->after('effective_rate_bp');
            $table->unsignedSmallInteger('liberating_payment_rate_bp')->nullable()->after('liberating_payment');
        });
    }

    public function down(): void
    {
        Schema::table('contribution_rates', function (Blueprint $table): void {
            $table->dropColumn(['liberating_payment', 'liberating_payment_rate_bp']);
        });
    }
};
