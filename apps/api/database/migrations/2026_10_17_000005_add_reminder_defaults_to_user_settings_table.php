<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // What every new invoice starts with for its automatic reminders; each
        // invoice can still differ at send time. Off for existing accounts: a
        // reminder nobody asked for is the one e-mail a client remembers.
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->boolean('reminders_default_enabled')->default(false)->after('document_language');
            $table->unsignedTinyInteger('reminders_default_frequency')->default(0)->after('reminders_default_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['reminders_default_enabled', 'reminders_default_frequency']);
        });
    }
};
