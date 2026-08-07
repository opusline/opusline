<?php

declare(strict_types=1);

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
        Schema::create('time_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Mission::class)->constrained()->restrictOnDelete();
            $table->date('date');
            $table->unsignedSmallInteger('duration_minutes');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['mission_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_entries');
    }
};
