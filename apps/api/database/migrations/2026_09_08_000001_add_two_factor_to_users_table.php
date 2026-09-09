<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->text('totp_secret')->nullable()->after('remember_token');
            $table->timestamp('totp_confirmed_at')->nullable()->after('totp_secret');
            // The 30-second step of the last accepted code: a code is valid for
            // up to three steps, so without this a captured code could be
            // replayed inside its window.
            $table->unsignedBigInteger('totp_last_used_step')->nullable()->after('totp_confirmed_at');
            $table->text('two_factor_recovery_codes')->nullable()->after('totp_last_used_step');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'totp_secret',
                'totp_confirmed_at',
                'totp_last_used_step',
                'two_factor_recovery_codes',
            ]);
        });
    }
};
