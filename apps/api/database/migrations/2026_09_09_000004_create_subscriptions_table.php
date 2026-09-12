<?php

declare(strict_types=1);

use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->string('supplier', 120);
            $table->unsignedTinyInteger('category');
            $table->string('description', 255)->nullable();
            $table->unsignedTinyInteger('vat_treatment');
            $table->unsignedSmallInteger('vat_rate_bp');
            $table->unsignedSmallInteger('pro_share_bp');
            $table->unsignedTinyInteger('periodicity');
            // The day of the month the debit lands; clamped to the month's end
            // when read, so a 31 stays a 31 through February.
            $table->unsignedTinyInteger('debit_day');
            $table->unsignedTinyInteger('debit_month')->nullable();
            $table->date('started_on');
            $table->date('cancelled_on')->nullable();
            $table->boolean('is_paused')->default(false);
            $table->boolean('auto_create_expenses')->default(true);
            $table->boolean('provision_monthly')->default(false);
            $table->string('customer_space_url', 2048)->nullable();
            // No amount column: the amount in force is always a history row,
            // so a price change never rewrites what earlier debits cost.
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->timestamps();

            $table->index(['user_id', 'cancelled_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
