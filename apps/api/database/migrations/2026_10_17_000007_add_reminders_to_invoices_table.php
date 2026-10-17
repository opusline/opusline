<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Set when the invoice goes out, from the account's defaults unless
        // the send page says otherwise; what the reminder command reads.
        Schema::table('invoices', function (Blueprint $table): void {
            $table->boolean('reminders_enabled')->default(false)->after('notes');
            $table->unsignedTinyInteger('reminders_frequency')->default(0)->after('reminders_enabled');
            $table->json('reminder_recipients')->nullable()->after('reminders_frequency');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropColumn(['reminders_enabled', 'reminders_frequency', 'reminder_recipients']);
        });
    }
};
