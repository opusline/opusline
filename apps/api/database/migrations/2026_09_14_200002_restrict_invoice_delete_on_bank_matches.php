<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The three FK children of `invoices` disagreed on what a delete means:
 * `time_entries` nulls the link, `bank_movements` refuses the delete, and
 * `bank_matches` quietly took the suggestion with it.
 *
 * Only a draft is deletable (`DeleteInvoice` answers 409 otherwise) and a
 * suggestion is only ever raised against an issued one, so the cascade never
 * fired — it just meant the rule lived in one action and nowhere else. With
 * this, refusing to delete an invoice something reconciled against is the
 * database's answer too, as it already is for the movement.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_matches', function (Blueprint $table): void {
            $table->dropForeign(['invoice_id']);
            $table->foreign('invoice_id')->references('id')->on('invoices')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bank_matches', function (Blueprint $table): void {
            $table->dropForeign(['invoice_id']);
            $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
        });
    }
};
