<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Until now an account held one bank account implicitly: its statements, its
 * movements, its connection and the balance typed in its settings. Each of
 * them now names the bank account it belongs to, and the existing data
 * becomes that account's first one.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_statements', function (Blueprint $table): void {
            $table->foreignId('bank_account_id')->nullable()->after('user_id')->constrained()->restrictOnDelete();
        });

        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->foreignId('bank_account_id')->nullable()->after('user_id')->constrained()->restrictOnDelete();
            // The other side of a transfer between two of the user's own accounts.
            $table->foreignId('transfer_counterpart_id')->nullable()->after('expense_id')->constrained('bank_movements')->nullOnDelete();
        });

        Schema::table('bank_connections', function (Blueprint $table): void {
            // Set once the user picked which of the consent's accounts to sync.
            $table->foreignId('bank_account_id')->nullable()->unique()->after('user_id')->constrained()->nullOnDelete();
        });

        $this->backfillOneAccountPerUser();

        Schema::table('bank_statements', function (Blueprint $table): void {
            $table->foreignId('bank_account_id')->nullable(false)->change();
            $table->index(['bank_account_id', 'period_end']);
        });

        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->foreignId('bank_account_id')->nullable(false)->change();
            // File rows hash by content, so two accounts can carry the same hash.
            $table->dropUnique(['user_id', 'dedup_hash']);
            $table->unique(['bank_account_id', 'dedup_hash']);
            $table->index(['bank_account_id', 'booked_on', 'id']);
            $table->index(['transfer_counterpart_id']);
        });

        Schema::table('bank_connections', function (Blueprint $table): void {
            // Added before the unique goes, so the user foreign key is never left without an index.
            $table->index(['user_id']);
        });

        Schema::table('bank_connections', function (Blueprint $table): void {
            $table->dropUnique(['user_id']);
        });

        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['bank_balance_cents', 'bank_balance_recorded_on']);
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->bigInteger('bank_balance_cents')->nullable()->after('treasury_buffer_cents');
            $table->date('bank_balance_recorded_on')->nullable()->after('bank_balance_cents');
        });

        $firstAccounts = DB::table('bank_accounts')
            ->whereNotNull('balance_cents')
            ->orderBy('id')
            ->get(['user_id', 'balance_cents', 'balance_recorded_on'])
            ->unique('user_id');

        foreach ($firstAccounts as $account) {
            DB::table('user_settings')->where('user_id', $account->user_id)->update([
                'bank_balance_cents' => $account->balance_cents,
                'bank_balance_recorded_on' => $account->balance_recorded_on,
            ]);
        }

        Schema::table('bank_connections', function (Blueprint $table): void {
            $table->unique(['user_id']);
        });

        Schema::table('bank_connections', function (Blueprint $table): void {
            $table->dropIndex(['user_id']);
            $table->dropConstrainedForeignId('bank_account_id');
        });

        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->dropIndex(['transfer_counterpart_id']);
            $table->dropIndex(['bank_account_id', 'booked_on', 'id']);
            $table->dropUnique(['bank_account_id', 'dedup_hash']);
            $table->unique(['user_id', 'dedup_hash']);
            $table->dropConstrainedForeignId('transfer_counterpart_id');
            $table->dropConstrainedForeignId('bank_account_id');
        });

        Schema::table('bank_statements', function (Blueprint $table): void {
            $table->dropIndex(['bank_account_id', 'period_end']);
            $table->dropConstrainedForeignId('bank_account_id');
        });
    }

    private function backfillOneAccountPerUser(): void
    {
        $userIds = DB::table('bank_statements')->distinct()->pluck('user_id')
            ->merge(DB::table('bank_connections')->pluck('user_id'))
            ->merge(DB::table('user_settings')->whereNotNull('bank_balance_cents')->pluck('user_id'))
            ->unique()
            ->values();

        foreach ($userIds as $userId) {
            $settings = DB::table('user_settings')->where('user_id', $userId)->first(['currency', 'bank_balance_cents', 'bank_balance_recorded_on']);
            $connection = DB::table('bank_connections')->where('user_id', $userId)->first(['id', 'account_identification_hash']);
            $now = now();

            $accountId = DB::table('bank_accounts')->insertGetId([
                'user_id' => $userId,
                'name' => null,
                'identification_hash' => $connection?->account_identification_hash,
                'balance_cents' => $settings?->bank_balance_cents,
                'balance_recorded_on' => $settings?->bank_balance_recorded_on,
                'currency' => $settings->currency ?? 'EUR',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('bank_statements')->where('user_id', $userId)->update(['bank_account_id' => $accountId]);
            DB::table('bank_movements')->where('user_id', $userId)->update(['bank_account_id' => $accountId]);

            if ($connection !== null && $connection->account_identification_hash !== null) {
                DB::table('bank_connections')->where('id', $connection->id)->update(['bank_account_id' => $accountId]);
            }
        }
    }
};
