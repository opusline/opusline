<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            // Copied off the client when the invoice is drawn up, not read back
            // through the relation: reclassifying a client must not silently
            // rewrite the legal mention on invoices already sent.
            $table->unsignedTinyInteger('vat_treatment')->default(0)->after('vat_rate_bp');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropColumn('vat_treatment');
        });
    }
};
