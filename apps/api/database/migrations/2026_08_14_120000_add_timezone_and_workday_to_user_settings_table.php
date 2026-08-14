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
            $table->string('timezone', 64)->default('Europe/Paris')->after('date_format');
            $table->unsignedSmallInteger('workday_minutes')->default(420)->after('timezone');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['timezone', 'workday_minutes']);
        });
    }
};
