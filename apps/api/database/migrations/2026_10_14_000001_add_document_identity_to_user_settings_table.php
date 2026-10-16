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
            // Printed on every invoice Opusline issues: the IBAN is what the
            // client transfers to, so it is held encrypted like the bank keys.
            $table->text('iban')->nullable()->after('vat_number');
            $table->string('bic', 11)->nullable()->after('iban');
            $table->string('trade_registry')->nullable()->after('bic');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['iban', 'bic', 'trade_registry']);
        });
    }
};
