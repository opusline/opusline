<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            // The commune sets the CFE. Optional twice over: without it the app
            // estimates from last year's detected CFE payment, and entering it
            // overrides that estimate — and feeds the treasury provision.
            $table->unsignedBigInteger('cfe_expected_cents')->nullable()->after('bank_balance_recorded_on');

            // Bearer credential for the unauthenticated ICS feed. Stored in the clear
            // because the screen has to show the URL back; rotating it is one click.
            $table->string('calendar_token', 64)->nullable()->unique()->after('cfe_expected_cents');

            // Watermark, like users.release_notes_seen_version: a reminder is unread
            // when it triggered after this. Nothing per-reminder to store.
            $table->timestamp('deadline_reminders_read_at')->nullable()->after('calendar_token');

            // What the subscribed calendar carries — the dialog's checkboxes,
            // stored so the unauthenticated feed route can honour them.
            // Relances default off: a task-nag in a calendar is opt-in.
            $table->boolean('calendar_feed_invoices')->default(true)->after('deadline_reminders_read_at');
            $table->boolean('calendar_feed_reminders')->default(false)->after('calendar_feed_invoices');
            $table->boolean('calendar_feed_vat')->default(true)->after('calendar_feed_reminders');
            $table->boolean('calendar_feed_urssaf')->default(true)->after('calendar_feed_vat');
            $table->boolean('calendar_feed_other')->default(true)->after('calendar_feed_urssaf');

            // The subscription lifecycle: the day the user said « j'ai ajouté
            // l'adresse », and the last time a calendar actually came to fetch
            // the feed — the second is what proves the webcal is alive.
            $table->date('calendar_subscribed_on')->nullable()->after('calendar_feed_other');
            $table->timestamp('calendar_last_synced_at')->nullable()->after('calendar_subscribed_on');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn([
                'cfe_expected_cents',
                'calendar_token',
                'deadline_reminders_read_at',
                'calendar_feed_invoices',
                'calendar_feed_reminders',
                'calendar_feed_vat',
                'calendar_feed_urssaf',
                'calendar_feed_other',
                'calendar_subscribed_on',
                'calendar_last_synced_at',
            ]);
        });
    }
};
