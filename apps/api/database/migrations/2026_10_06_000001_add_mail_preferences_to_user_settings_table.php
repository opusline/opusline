<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Which emails the account wants. Both default on: nothing leaves an instance
 * whose operator named no mailer, so the default only decides what happens the
 * day one is configured — and a reminder nobody asked for is found sooner than
 * one that never came.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->boolean('mail_security_alerts')->default(true)->after('calendar_last_synced_at');
            $table->boolean('mail_deadline_reminders')->default(true)->after('mail_security_alerts');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['mail_security_alerts', 'mail_deadline_reminders']);
        });
    }
};
