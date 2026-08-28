<?php

declare(strict_types=1);

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
        Schema::create('fiscal_deadline_completions', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('kind');
            // The occurrence this settles: `2026-07`, `2026-Q3` or `2026`. The
            // deadlines themselves are derived from the fiscal profile on every
            // request, so this key is the only durable handle on one of them —
            // and it survives a settings change that moves the date.
            $table->string('period_key', 16);
            $table->date('due_on');
            // The account's own calendar day, not the server's clock: every other
            // date in this feature is cut against UserSettings::today().
            $table->date('completed_on');
            $table->timestamps();

            $table->unique(['user_id', 'kind', 'period_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiscal_deadline_completions');
    }
};
