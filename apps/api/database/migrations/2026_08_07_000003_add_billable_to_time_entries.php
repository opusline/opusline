<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('time_entries', function (Blueprint $table): void {
            $table->boolean('billable')->default(true)->after('duration_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('time_entries', function (Blueprint $table): void {
            $table->dropColumn('billable');
        });
    }
};
