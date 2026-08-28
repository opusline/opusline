<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `foreignIdFor(...)->constrained()` emits the constraint but no index. InnoDB
 * creates one implicitly, Postgres and SQLite do not, and the suite runs on all
 * three.
 *
 * All seven read on hot paths, and five sit behind `restrictOnDelete`: without
 * the index, deleting a client makes Postgres scan every mission and every
 * invoice to prove the restriction holds.
 */
return new class extends Migration
{
    /** @var array<string, list<string>> */
    private const array MISSING_INDEXES = [
        'missions' => ['client_id'],
        'invoices' => ['client_id', 'mission_id'],
        'time_entries' => ['invoice_id'],
        'running_timers' => ['mission_id'],
        'bank_movements' => ['bank_statement_id', 'invoice_id'],
    ];

    public function up(): void
    {
        foreach (self::MISSING_INDEXES as $table => $columns) {
            Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
                foreach ($columns as $column) {
                    $blueprint->index($column);
                }
            });
        }
    }

    public function down(): void
    {
        foreach (self::MISSING_INDEXES as $table => $columns) {
            Schema::table($table, function (Blueprint $blueprint) use ($columns): void {
                foreach ($columns as $column) {
                    $blueprint->dropIndex([$column]);
                }
            });
        }
    }
};
