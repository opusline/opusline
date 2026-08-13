<?php

declare(strict_types=1);

use App\Domain\Cra\Models\Cra;
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
        Schema::create('cra_days', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(Cra::class)->constrained()->cascadeOnDelete();
            $table->date('date');

            // A fraction of a workday in basis points: 10000 is a full day, 5000 a half.
            // Integer because a signed figure must not drift, and because minute rounding
            // produces fractions no float represents exactly. Only worked days get a row.
            $table->unsignedSmallInteger('day_fraction_bp');

            $table->unique(['cra_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cra_days');
    }
};
