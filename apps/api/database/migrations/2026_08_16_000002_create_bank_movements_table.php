<?php

declare(strict_types=1);

use App\Domain\Bank\Models\BankStatement;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
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
        Schema::create('bank_movements', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            // The first statement that imported the row; overlapping re-imports skip it.
            $table->foreignIdFor(BankStatement::class)->constrained()->restrictOnDelete();
            // Set when a reconciliation is validated.
            $table->foreignIdFor(Invoice::class)->nullable()->constrained()->restrictOnDelete();
            $table->date('booked_on');
            $table->string('label');
            // Signed: credits positive, debits negative.
            $table->bigInteger('amount_cents');
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->char('dedup_hash', 64);
            $table->timestamps();

            $table->unique(['user_id', 'dedup_hash']);
            $table->index(['user_id', 'booked_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_movements');
    }
};
