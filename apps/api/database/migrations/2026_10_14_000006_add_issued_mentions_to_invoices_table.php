<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Mentions the account sets once in its invoicing settings, copied onto
        // an invoice when it is issued so a later change cannot rewrite it.
        Schema::table('invoices', function (Blueprint $table): void {
            $table->unsignedTinyInteger('operation_category')->nullable()->after('custom_mentions');
            $table->boolean('vat_on_debits')->default(false)->after('operation_category');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropColumn(['operation_category', 'vat_on_debits']);
        });
    }
};
