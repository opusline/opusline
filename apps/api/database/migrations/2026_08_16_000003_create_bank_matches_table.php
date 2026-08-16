<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Invoices\Models\Invoice;
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
        Schema::create('bank_matches', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(BankMovement::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Invoice::class)->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('status')->default(BankMatchStatus::Pending->value);
            $table->unsignedTinyInteger('reason');
            $table->timestamps();

            // One suggestion per movement, ever — a dismissed row keeps occupying
            // the slot so overlapping re-imports cannot resurrect the suggestion.
            $table->unique('bank_movement_id');
            $table->index(['user_id', 'status']);
            $table->index('invoice_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_matches');
    }
};
