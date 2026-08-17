<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            // Defaults to Standard so no existing client changes how it bills:
            // the exemptions are opt-in, one client at a time.
            $table->unsignedTinyInteger('vat_treatment')->default(0)->after('vat_number');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->dropColumn('vat_treatment');
        });
    }
};
