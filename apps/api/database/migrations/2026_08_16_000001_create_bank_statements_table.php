<?php

declare(strict_types=1);

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
        Schema::create('bank_statements', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->string('file_name');
            $table->unsignedTinyInteger('format');
            $table->date('period_start');
            $table->date('period_end');
            $table->unsignedInteger('line_count');
            // Signed: an overdrawn business account is a legal state, not an error.
            $table->bigInteger('closing_balance_cents')->nullable();
            $table->date('closing_balance_on')->nullable();
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->timestamps();

            $table->index(['user_id', 'period_end']);
            $table->index(['user_id', 'closing_balance_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_statements');
    }
};
