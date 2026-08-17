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
     * Transfers the freelancer made from their own bank to their own account.
     * Opusline never moves money — this is a note of one that already happened,
     * so "combien je peux me virer" stops offering it a second time before the
     * next statement reports it.
     */
    public function up(): void
    {
        Schema::create('treasury_transfers', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->date('transferred_on');
            // Unsigned: a transfer out is always a withdrawal, and storing it
            // signed would invite adding it where it should be subtracted.
            $table->unsignedBigInteger('amount_cents');
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'transferred_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treasury_transfers');
    }
};
