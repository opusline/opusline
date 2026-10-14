<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Who sold and who bought, as they stood the day the invoice was
        // issued: an address or a SIRET changed later must not rewrite an
        // invoice the client already holds.
        Schema::table('invoices', function (Blueprint $table): void {
            $table->json('seller_snapshot')->nullable()->after('custom_mentions');
            $table->json('buyer_snapshot')->nullable()->after('seller_snapshot');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table): void {
            $table->dropColumn(['seller_snapshot', 'buyer_snapshot']);
        });
    }
};
