<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\MissionStatus;
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
        Schema::create('missions', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Client::class)->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('end_client_name')->nullable();
            $table->unsignedTinyInteger('billing_mode');
            $table->unsignedBigInteger('rate_cents')->nullable();
            $table->char('currency', 3)->default('EUR');
            $table->unsignedTinyInteger('rounding')->nullable();
            $table->unsignedTinyInteger('status')->default(MissionStatus::Active->value);
            $table->boolean('cra_required')->default(false);
            $table->unsignedTinyInteger('color')->nullable();
            $table->text('notes')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
