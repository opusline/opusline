<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Money a credit note sends back to the client is a payment of the invoice
 * going the other way: negative, dated the day it left, and naming the
 * credit note it settles. The cash-basis figures read it like any payment.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_payments', function (Blueprint $table): void {
            $table->foreignId('credit_note_id')->nullable()->after('bank_movement_id')->constrained()->restrictOnDelete();
            $table->index('credit_note_id');
        });
    }

    public function down(): void
    {
        Schema::table('invoice_payments', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('credit_note_id');
        });
    }
};
