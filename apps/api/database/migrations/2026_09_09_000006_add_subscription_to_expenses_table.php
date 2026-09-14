<?php

declare(strict_types=1);

use App\Domain\Expenses\Models\Subscription;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table): void {
            // The occurrence this expense is: one row per subscription and
            // period, so a second read never creates the debit twice. The
            // subscription may go; its past debits stay in the journal.
            $table->foreignIdFor(Subscription::class)->nullable()->after('user_id')->constrained()->nullOnDelete();
            $table->string('subscription_period_key', 16)->nullable()->after('subscription_id');

            $table->unique(['subscription_id', 'subscription_period_key']);
            // A deleted debit stays as a tombstone: the bank did not take it,
            // and the next read must not write it again.
            $table->softDeletes();
        });

        Schema::table('subscriptions', function (Blueprint $table): void {
            // The first day an occurrence may be written for — the account's
            // own calendar day it was recorded, moved forward on every
            // resume so a pause skips its months instead of back-filling them.
            $table->date('occurrences_from')->nullable()->after('started_on');
        });
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table): void {
            $table->dropColumn('occurrences_from');
        });

        Schema::table('expenses', function (Blueprint $table): void {
            $table->dropSoftDeletes();
            $table->dropUnique(['subscription_id', 'subscription_period_key']);
            $table->dropConstrainedForeignIdFor(Subscription::class);
            $table->dropColumn('subscription_period_key');
        });
    }
};
