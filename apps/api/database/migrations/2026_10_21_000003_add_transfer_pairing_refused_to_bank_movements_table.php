<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_movements', function (Blueprint $table): void {
            // The user said this movement is not one side of a transfer between
            // their own accounts: the pairing never proposes it again.
            $table->boolean('transfer_pairing_refused')->default(false)->after('transfer_counterpart_id');
        });
    }

    public function down(): void
    {
        Schema::table('bank_movements', function (Blueprint $table): void {
            $table->dropColumn('transfer_pairing_refused');
        });
    }
};
