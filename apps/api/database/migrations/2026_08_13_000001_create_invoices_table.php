<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
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
        Schema::create('invoices', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Client::class)->constrained()->restrictOnDelete();
            $table->foreignIdFor(Mission::class)->nullable()->constrained()->restrictOnDelete();
            $table->string('number')->nullable();
            $table->unsignedTinyInteger('status')->default(InvoiceStatus::Draft->value);

            $table->date('issued_on');
            $table->date('due_on');
            $table->date('paid_on')->nullable();
            $table->date('period_start')->nullable();
            $table->date('period_end')->nullable();
            $table->unsignedBigInteger('amount_ht_cents');
            $table->unsignedBigInteger('amount_ttc_cents');
            $table->unsignedInteger('vat_rate_bp');
            $table->char('currency', 3)->default(Currency::EUR->value);

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'number']);
            $table->index(['user_id', 'issued_on']);
            $table->index(['user_id', 'status', 'due_on']);
            $table->index(['user_id', 'paid_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
