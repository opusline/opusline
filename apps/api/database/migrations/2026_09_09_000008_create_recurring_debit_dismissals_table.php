<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recurring_debit_dismissals', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            // A recurring debit is recognised by its normalised label and its
            // cents, so that pair is what « Ignorer » remembers — not money in
            // any currency, a fingerprint.
            $table->string('label_key', 255);
            $table->unsignedBigInteger('amount_cents');
            $table->timestamps();

            $table->unique(['user_id', 'label_key', 'amount_cents']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recurring_debit_dismissals');
    }
};
