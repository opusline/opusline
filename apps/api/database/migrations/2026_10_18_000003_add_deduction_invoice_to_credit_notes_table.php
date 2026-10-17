<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A credit note whose money is « deducted from a later invoice » is claimed by
 * that invoice's draft, and settled when it is issued.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('credit_notes', function (Blueprint $table): void {
            $table->foreignId('deduction_invoice_id')->nullable()->after('settled_on')->constrained('invoices')->nullOnDelete();
            $table->index('deduction_invoice_id');
        });
    }

    public function down(): void
    {
        Schema::table('credit_notes', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('deduction_invoice_id');
        });
    }
};
