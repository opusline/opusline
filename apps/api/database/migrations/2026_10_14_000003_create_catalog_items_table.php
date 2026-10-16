<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The services an account sells again and again, ready to add to an
        // invoice or a quote. A document copies the values onto its line, so
        // changing a price here never touches anything already issued.
        Schema::create('catalog_items', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label');
            $table->text('detail')->nullable();
            $table->unsignedTinyInteger('unit');
            $table->unsignedBigInteger('unit_price_cents');
            $table->char('currency', 3);
            $table->unsignedSmallInteger('vat_rate_bp');
            $table->timestamps();

            $table->index(['user_id', 'label']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_items');
    }
};
