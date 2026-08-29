<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The list queries on the two biggest tables order by `(date DESC, id DESC)`,
 * and Postgres and SQLite add a sort node on every one of them because no index
 * covers the `id` tiebreak — InnoDB appends the PK to secondary indexes, so
 * MySQL alone was fine. Each new index supersedes the two-column one it
 * extends, so the net index count is zero.
 *
 * The standalone FK indexes from 2026_08_28_000001 stay: Postgres FK checks
 * still read them.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('time_entries', function (Blueprint $table): void {
            $table->index(['user_id', 'date', 'id']);
            $table->index(['mission_id', 'date', 'id']);
            $table->index(['user_id', 'invoice_id', 'date']);
            $table->dropIndex(['user_id', 'date']);
            $table->dropIndex(['mission_id', 'date']);
            $table->dropIndex(['user_id', 'invoice_id']);
        });

        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->index(['user_id', 'booked_on', 'id']);
            $table->dropIndex(['user_id', 'booked_on']);
        });
    }

    public function down(): void
    {
        Schema::table('time_entries', function (Blueprint $table): void {
            $table->index(['user_id', 'date']);
            $table->index(['mission_id', 'date']);
            $table->index(['user_id', 'invoice_id']);
            $table->dropIndex(['user_id', 'date', 'id']);
            $table->dropIndex(['mission_id', 'date', 'id']);
            $table->dropIndex(['user_id', 'invoice_id', 'date']);
        });

        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->index(['user_id', 'booked_on']);
            $table->dropIndex(['user_id', 'booked_on', 'id']);
        });
    }
};
