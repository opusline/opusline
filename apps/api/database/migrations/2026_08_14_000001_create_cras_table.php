<?php

declare(strict_types=1);

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Missions\Models\Mission;
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
        Schema::create('cras', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Mission::class)->constrained()->restrictOnDelete();

            // The first day of the covered month; a CRA is always a whole month.
            $table->date('month');
            $table->unsignedTinyInteger('status')->default(CraStatus::Draft->value);

            $table->date('sent_on')->nullable();
            $table->date('signed_on')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['mission_id', 'month']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cras');
    }
};
