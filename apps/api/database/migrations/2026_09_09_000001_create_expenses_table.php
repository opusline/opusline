<?php

declare(strict_types=1);

use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->string('supplier', 120);
            $table->unsignedTinyInteger('category');
            $table->string('description', 255)->nullable();
            $table->date('spent_on');
            $table->unsignedTinyInteger('vat_treatment');
            $table->unsignedSmallInteger('vat_rate_bp');
            $table->unsignedSmallInteger('pro_share_bp');
            // TTC is what the receipt says and what was typed; HT is derived from
            // it at write time so the two never drift once stored.
            $table->unsignedBigInteger('amount_ttc_cents');
            $table->unsignedBigInteger('amount_ht_cents');
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->timestamps();

            $table->index(['user_id', 'spent_on', 'id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
