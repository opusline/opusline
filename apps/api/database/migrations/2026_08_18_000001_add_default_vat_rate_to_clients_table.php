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
        Schema::table('clients', function (Blueprint $table): void {
            // Nullable on purpose: null follows the account default, 0 is a client
            // that is never charged TVA. Collapsing the two would silently pin every
            // existing client to today's rate.
            $table->unsignedInteger('default_vat_rate_bp')
                ->nullable()
                ->after('vat_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->dropColumn('default_vat_rate_bp');
        });
    }
};
