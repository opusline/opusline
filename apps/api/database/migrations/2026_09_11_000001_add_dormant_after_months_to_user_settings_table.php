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
            // Null is off, which is the default: nothing retires anyone's work
            // until they ask for it. When set, it is the number of months of
            // silence after which a mission is finished and a client archived.
            $table->unsignedTinyInteger('dormant_after_months')->nullable()->after('workday_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn('dormant_after_months');
        });
    }
};
