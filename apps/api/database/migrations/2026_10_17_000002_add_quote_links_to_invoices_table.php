<?php

declare(strict_types=1);

use App\Domain\Invoices\Models\Quote;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // An invoice built from a quote remembers it: the quote lists what it
        // has billed so far, the invoice says where it comes from.
        Schema::table('invoices', function (Blueprint $table): void {
            $table->foreignIdFor(Quote::class)->nullable()->after('mission_id')->constrained()->restrictOnDelete();
            $table->unsignedTinyInteger('quote_billing')->nullable()->after('quote_id');

            $table->index(['quote_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropIndex(['quote_id', 'status']);
            $table->dropConstrainedForeignIdFor(Quote::class);
            $table->dropColumn('quote_billing');
        });
    }
};
