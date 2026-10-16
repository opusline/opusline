<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\InvoiceSource;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Every quote so far was written in Opusline; one recorded from another
        // tool keeps that tool's reference and PDF, and has no sheet here.
        Schema::table('quotes', function (Blueprint $table): void {
            $table->unsignedTinyInteger('source')->default(InvoiceSource::Opusline->value)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table): void {
            $table->dropColumn('source');
        });
    }
};
