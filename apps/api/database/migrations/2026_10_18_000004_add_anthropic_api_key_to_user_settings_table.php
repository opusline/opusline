<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            // Per account rather than per instance: whoever pastes the key pays
            // for what Claude reads and agrees to send it there.
            $table->text('anthropic_api_key')->nullable()->after('enable_banking_private_key');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn('anthropic_api_key');
        });
    }
};
