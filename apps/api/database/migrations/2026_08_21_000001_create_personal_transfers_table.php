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
        Schema::create('personal_transfers', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->date('transferred_on');
            // Unsigned, unlike the deliberately signed bank tables: a payout to
            // the personal account only ever leaves the pro account. Postgres
            // and SQLite drop the modifier, so the invariant that actually
            // holds everywhere is MoneyData's positive floor on the request.
            $table->unsignedBigInteger('amount_cents');
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'transferred_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_transfers');
    }
};
