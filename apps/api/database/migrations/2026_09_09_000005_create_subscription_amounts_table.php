<?php

declare(strict_types=1);

use App\Domain\Expenses\Models\Subscription;
use App\Domain\Shared\Enums\Currency;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_amounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(Subscription::class)->constrained()->cascadeOnDelete();
            $table->date('effective_from');
            $table->unsignedBigInteger('amount_ht_cents');
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->timestamps();

            $table->unique(['subscription_id', 'effective_from']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_amounts');
    }
};
