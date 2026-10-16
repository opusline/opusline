<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('e_invoicing_connections', function (Blueprint $table): void {
            $table->id();
            // One platform per account: the annuaire routes a company to one.
            $table->foreignIdFor(User::class)->unique()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('platform');
            $table->string('client_id', 128);
            $table->text('client_secret');
            // What the platform last said about the company, so the settings
            // page reads it without a call: refreshed by every connection check.
            $table->string('company_name')->nullable();
            $table->string('company_number', 32)->nullable();
            $table->unsignedTinyInteger('environment')->nullable();
            $table->boolean('company_verified')->default(false);
            $table->string('receiving_address')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('e_invoicing_connections');
    }
};
