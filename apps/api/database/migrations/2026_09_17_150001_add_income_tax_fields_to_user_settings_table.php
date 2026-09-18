<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * What the avis d'imposition says about the household, read by two rules the
 * account cannot derive: whether the versement libératoire may still apply
 * (the revenu fiscal de référence against a per-part limit), and how much
 * income tax to set aside once it does not (the prélèvement à la source rate).
 * All nullable: nothing is claimed until the user has copied them in.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->unsignedBigInteger('reference_tax_income_cents')->nullable()->after('liberating_payment_rate_bp');
            // The year of income the RFR measures — the avis sent in N prints N−1's.
            $table->unsignedSmallInteger('reference_tax_income_year')->nullable()->after('reference_tax_income_cents');
            // Quarter parts, because a shared custody adds a quarter: 4 is one part.
            $table->unsignedSmallInteger('tax_household_quarter_parts')->nullable()->after('reference_tax_income_year');
            $table->unsignedSmallInteger('income_tax_rate_bp')->nullable()->after('tax_household_quarter_parts');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn([
                'reference_tax_income_cents',
                'reference_tax_income_year',
                'tax_household_quarter_parts',
                'income_tax_rate_bp',
            ]);
        });
    }
};
