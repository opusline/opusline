<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            // Its own series: a quote's number never counts in the invoices'.
            $table->string('quote_number_format', 64)->default('D-AAAA-NNN')->after('invoice_number_format');
        });

        // A quote is an invoice's shape before the work: the same lines and
        // parties, a validity instead of a due date, a deposit instead of a
        // payment, and a decision instead of a payment date.
        Schema::create('quotes', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Client::class)->constrained()->restrictOnDelete();
            $table->foreignIdFor(Mission::class)->nullable()->constrained()->restrictOnDelete();
            $table->string('number')->nullable();
            $table->unsignedTinyInteger('status')->default(QuoteStatus::Draft->value);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('language')->nullable();
            $table->date('issued_on');
            $table->unsignedSmallInteger('validity_days');
            $table->date('valid_until');
            // Null states no deposit: the whole sum is billed once the work is done.
            $table->unsignedSmallInteger('deposit_rate_bp')->nullable();
            $table->unsignedSmallInteger('payment_terms_days');
            $table->boolean('payment_terms_end_of_month')->default(false);
            $table->boolean('show_email')->default(false);
            $table->text('custom_mentions')->nullable();
            $table->json('seller_snapshot')->nullable();
            $table->json('buyer_snapshot')->nullable();
            $table->date('accepted_on')->nullable();
            $table->date('refused_on')->nullable();
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->unsignedBigInteger('amount_ht_cents');
            $table->unsignedBigInteger('amount_ttc_cents');
            $table->unsignedInteger('vat_rate_bp');
            $table->timestamps();

            $table->unique(['user_id', 'number']);
            $table->index(['user_id', 'status', 'valid_until']);
            $table->index(['user_id', 'issued_on']);
            $table->index(['client_id', 'issued_on']);
            $table->index(['mission_id', 'issued_on']);
        });

        Schema::create('quote_lines', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('position');
            $table->string('label');
            $table->text('detail')->nullable();
            $table->unsignedBigInteger('quantity_milli');
            $table->unsignedTinyInteger('unit');
            $table->bigInteger('unit_price_cents');
            $table->char('currency', 3);
            $table->unsignedSmallInteger('vat_rate_bp');
            $table->bigInteger('total_ht_cents');
            $table->timestamps();

            $table->index(['quote_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_lines');
        Schema::dropIfExists('quotes');

        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn('quote_number_format');
        });
    }
};
