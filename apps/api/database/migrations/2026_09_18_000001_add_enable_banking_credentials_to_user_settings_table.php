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
            // Each account brings its own Enable Banking application: in the
            // free restricted mode an application only reaches the accounts its
            // owner linked, so one instance-wide key could serve one person.
            $table->string('enable_banking_application_id', 36)->nullable()->after('cfe_expected_cents');
            $table->text('enable_banking_private_key')->nullable()->after('enable_banking_application_id');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['enable_banking_application_id', 'enable_banking_private_key']);
        });
    }
};
