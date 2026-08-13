<?php

declare(strict_types=1);

use App\Domain\Invoices\Models\Invoice;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('time_entries', function (Blueprint $table): void {
            $table->foreignIdFor(Invoice::class)
                ->nullable()
                ->after('mission_id')
                ->constrained()
                ->nullOnDelete();

            $table->index(['user_id', 'invoice_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_entries', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'invoice_id']);
            $table->dropConstrainedForeignIdFor(Invoice::class);
        });
    }
};
