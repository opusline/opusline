<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table): void {
            // The id the plateforme agréée gave the received invoice: one
            // expense per received invoice, however many syncs see it.
            $table->string('e_invoice_platform_id', 64)->nullable()->after('subscription_period_key');
            $table->unsignedTinyInteger('e_invoice_status')->nullable()->after('e_invoice_platform_id');

            $table->unique(['user_id', 'e_invoice_platform_id']);
        });

        Schema::table('e_invoicing_connections', function (Blueprint $table): void {
            $table->timestamp('last_synced_at')->nullable()->after('checked_at');
            $table->unsignedTinyInteger('last_error')->nullable()->after('last_synced_at');
        });
    }

    public function down(): void
    {
        Schema::table('e_invoicing_connections', function (Blueprint $table): void {
            $table->dropColumn(['last_synced_at', 'last_error']);
        });

        Schema::table('expenses', function (Blueprint $table): void {
            $table->dropUnique(['user_id', 'e_invoice_platform_id']);
            $table->dropColumn(['e_invoice_platform_id', 'e_invoice_status']);
        });
    }
};
