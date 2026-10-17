<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * An issued invoice is never edited or deleted in France: it is corrected by a
 * credit note, a document of its own, numbered in its own continuous series,
 * that names the invoice it relates to. Its amounts are positive; what it
 * takes off the invoice is read from the invoice's side.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->string('credit_note_number_format', 64)->default('A-AAAA-NNN')->after('quote_number_format');
        });

        Schema::create('credit_notes', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Invoice::class)->constrained()->restrictOnDelete();
            $table->foreignIdFor(Client::class)->constrained()->restrictOnDelete();
            $table->string('number');
            $table->unsignedTinyInteger('status');
            $table->unsignedTinyInteger('kind');
            $table->unsignedTinyInteger('reason');
            $table->text('detail')->nullable();
            $table->unsignedTinyInteger('settlement');
            $table->unsignedTinyInteger('language');
            $table->date('issued_on');
            $table->date('settled_on')->nullable();
            $table->json('seller_snapshot');
            $table->json('buyer_snapshot');
            $table->char('currency', 3);
            $table->unsignedBigInteger('amount_ht_cents');
            $table->unsignedBigInteger('amount_ttc_cents');
            $table->unsignedInteger('vat_rate_bp');
            $table->timestamps();

            $table->unique(['user_id', 'number']);
            $table->index(['invoice_id', 'issued_on']);
            $table->index(['user_id', 'issued_on']);
            $table->index(['client_id', 'issued_on']);
        });

        Schema::create('credit_note_lines', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('credit_note_id')->constrained()->cascadeOnDelete();
            // The invoice line it takes back, when it takes one back.
            $table->foreignId('invoice_line_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('label');
            $table->text('detail')->nullable();
            $table->unsignedBigInteger('quantity_milli');
            $table->unsignedTinyInteger('unit');
            $table->bigInteger('unit_price_cents');
            $table->char('currency', 3);
            $table->unsignedSmallInteger('vat_rate_bp');
            $table->bigInteger('total_ht_cents');
            $table->timestamps();

            $table->index(['credit_note_id', 'position']);
            $table->index('invoice_line_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_note_lines');
        Schema::dropIfExists('credit_notes');

        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn('credit_note_number_format');
        });
    }
};
