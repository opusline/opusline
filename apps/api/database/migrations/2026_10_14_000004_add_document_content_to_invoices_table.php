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
            // Every invoice so far was issued in another tool and recorded here.
            $table->unsignedTinyInteger('source')->default(0)->after('status');
            $table->string('title')->nullable()->after('source');
            $table->text('description')->nullable()->after('title');
            $table->unsignedTinyInteger('language')->nullable()->after('description');
            $table->unsignedSmallInteger('payment_terms_days')->nullable()->after('due_on');
            $table->boolean('payment_terms_end_of_month')->default(false)->after('payment_terms_days');
            // Null states no rate on the document: the statutory one applies.
            $table->unsignedSmallInteger('late_penalty_rate_bp')->nullable()->after('payment_terms_end_of_month');
            $table->boolean('show_iban')->default(false)->after('late_penalty_rate_bp');
            $table->boolean('show_email')->default(false)->after('show_iban');
            $table->text('custom_mentions')->nullable()->after('show_email');
        });

        // The lines of an invoice Opusline writes. The header keeps their totals
        // (amount_ht_cents, amount_ttc_cents), so every aggregate — revenue,
        // URSSAF, CA3, provisions, bank matching — reads an Opusline invoice
        // exactly like a recorded one.
        Schema::create('invoice_lines', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('label');
            $table->text('detail')->nullable();
            // Thousandths, so half a day or a quarter hour is exact: 1500 is 1,5.
            $table->unsignedBigInteger('quantity_milli');
            $table->unsignedTinyInteger('unit');
            // Signed: a deduction (a credit note taken off, a deposit) is a negative line.
            $table->bigInteger('unit_price_cents');
            $table->char('currency', 3);
            $table->unsignedSmallInteger('vat_rate_bp');
            $table->bigInteger('total_ht_cents');
            $table->timestamps();

            $table->index(['invoice_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_lines');

        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropColumn([
                'source',
                'title',
                'description',
                'language',
                'payment_terms_days',
                'payment_terms_end_of_month',
                'late_penalty_rate_bp',
                'show_iban',
                'show_email',
                'custom_mentions',
            ]);
        });
    }
};
