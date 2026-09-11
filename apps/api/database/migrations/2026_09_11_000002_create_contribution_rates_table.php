<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contribution_rates', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // The effective rate — the URSSAF rate with versement libératoire
            // already in it — because that is the one figure a provision prices
            // with, and splitting it here would mean recombining it at read time.
            $table->unsignedSmallInteger('effective_rate_bp');
            $table->date('effective_from');
            $table->timestamps();

            // One rate per account per day: two changes on the same day are the
            // same decision being corrected, not two rates that both applied.
            $table->unique(['user_id', 'effective_from']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contribution_rates');
    }
};
