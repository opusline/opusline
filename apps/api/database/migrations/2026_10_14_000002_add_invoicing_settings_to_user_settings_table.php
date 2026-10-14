<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            // Existing accounts issue their invoices in another tool today, so
            // they keep the recording flow until they opt in.
            $table->unsignedTinyInteger('invoicing_mode')->default(1)->after('invoice_number_format');
            $table->boolean('default_payment_terms_end_of_month')->default(false)->after('default_payment_terms_days');
            $table->unsignedSmallInteger('quote_validity_days')->default(30)->after('invoicing_mode');
            // Null is the statutory rate (ECB + 10 points), which applies when
            // the invoice states none and never goes stale.
            $table->unsignedSmallInteger('late_penalty_rate_bp')->nullable()->after('quote_validity_days');
            $table->unsignedTinyInteger('operation_category')->default(0)->after('late_penalty_rate_bp');
            $table->boolean('show_iban_on_invoices')->default(true)->after('operation_category');
            $table->boolean('show_email_on_documents')->default(true)->after('show_iban_on_invoices');
            $table->boolean('vat_on_debits')->default(false)->after('show_email_on_documents');
            $table->text('custom_mentions')->nullable()->after('vat_on_debits');
            $table->unsignedTinyInteger('document_language')->default(0)->after('custom_mentions');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn([
                'invoicing_mode',
                'default_payment_terms_end_of_month',
                'quote_validity_days',
                'late_penalty_rate_bp',
                'operation_category',
                'show_iban_on_invoices',
                'show_email_on_documents',
                'vat_on_debits',
                'custom_mentions',
                'document_language',
            ]);
        });
    }
};
