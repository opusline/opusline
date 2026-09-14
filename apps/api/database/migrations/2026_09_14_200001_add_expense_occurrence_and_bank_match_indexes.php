<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Two reads that run on every page load and had to reach the heap for it.
 *
 * `MaterialiseSubscriptionOccurrences` asks whether the account already holds
 * a given (subscription, period) pair, scoped to the account: these three
 * columns are the whole question and the whole answer, so the index covers it
 * outright. The unique on (subscription_id, subscription_period_key) cannot —
 * it leads with a column the probe filters by a set, and carries no user_id.
 *
 * `ValidateBankMatch` resolves a suggestion's invoice through the account,
 * because nothing at the storage layer ties the two together.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table): void {
            $table->index(['user_id', 'subscription_id', 'subscription_period_key']);
        });

        Schema::table('bank_matches', function (Blueprint $table): void {
            $table->index(['user_id', 'invoice_id']);
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'subscription_id', 'subscription_period_key']);
        });

        Schema::table('bank_matches', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'invoice_id']);
        });
    }
};
