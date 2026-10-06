<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The account-local date the reminder email last ran for. The command that
 * sends it runs every hour, so this is what makes it once a day per account —
 * written even on a day with nothing to say, so that day is not recomputed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->date('deadline_reminders_mailed_on')->nullable()->after('mail_deadline_reminders');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn('deadline_reminders_mailed_on');
        });
    }
};
