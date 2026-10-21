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
        Schema::create('bank_accounts', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            // Null shows the default « Compte pro » label in the user's language.
            $table->string('name')->nullable();
            // The bank's fingerprint of the account, from a connection: a later
            // consent at the same bank finds the account again through it.
            $table->string('identification_hash')->nullable();
            // The hand-typed balance anchor. Signed: overdrafts are a legal state.
            $table->bigInteger('balance_cents')->nullable();
            $table->date('balance_recorded_on')->nullable();
            $table->char('currency', 3)->default(Currency::EUR->value);
            // A closed account keeps its history but no longer holds back the
            // treasury's coverage date.
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'identification_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
