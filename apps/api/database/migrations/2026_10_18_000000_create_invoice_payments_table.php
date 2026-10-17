<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * An invoice is paid by its payments, not on one date. A deposit, a client
 * who pays in two transfers, a refund going back out: each is a row, dated
 * the day the money moved, which is the day the cash-basis declarations read.
 * Every invoice paid so far becomes one payment for its whole amount on the
 * date it carried, so the fiscal figures of an existing account do not move.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            // Signed: a refund is a negative payment.
            $table->bigInteger('amount_cents');
            $table->char('currency', 3);
            $table->date('paid_on');
            // The movement an accepted bank match paid it with; one payment per movement.
            $table->foreignId('bank_movement_id')->nullable()->unique()->constrained()->restrictOnDelete();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(['invoice_id', 'paid_on']);
            $table->index(['user_id', 'paid_on']);
        });

        DB::table('invoice_payments')->insertUsing(
            ['user_id', 'invoice_id', 'amount_cents', 'currency', 'paid_on', 'created_at', 'updated_at'],
            DB::table('invoices')
                ->whereNotNull('paid_on')
                ->select([
                    'user_id',
                    DB::raw('id as invoice_id'),
                    DB::raw('amount_ttc_cents as amount_cents'),
                    'currency',
                    'paid_on',
                    DB::raw('CURRENT_TIMESTAMP as created_at'),
                    DB::raw('CURRENT_TIMESTAMP as updated_at'),
                ]),
        );

        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'paid_on']);
            $table->dropColumn('paid_on');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->date('paid_on')->nullable()->after('due_on');
            $table->index(['user_id', 'paid_on']);
        });

        /** @var object{invoice_id: int, paid_on: string} $payment */
        foreach (DB::table('invoice_payments')->orderBy('paid_on')->cursor() as $payment) {
            DB::table('invoices')->where('id', $payment->invoice_id)->update(['paid_on' => $payment->paid_on]);
        }

        Schema::dropIfExists('invoice_payments');
    }
};
