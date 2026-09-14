<?php

declare(strict_types=1);

use App\Domain\Expenses\Models\Expense;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_movements', function (Blueprint $table): void {
            // The expense a debit paid, mirroring invoice_id on the credit
            // side: one movement per expense, and a deleted expense frees it.
            $table->foreignIdFor(Expense::class)->nullable()->after('invoice_id')->constrained()->nullOnDelete();

            $table->unique('expense_id');
        });
    }

    public function down(): void
    {
        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->dropUnique(['expense_id']);
            $table->dropConstrainedForeignIdFor(Expense::class);
        });
    }
};
