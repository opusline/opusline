<?php

declare(strict_types=1);

use App\Domain\Bank\Models\BankStatement;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_connections', function (Blueprint $table): void {
            $table->id();
            // One per account, like the single Compte pro balance it feeds.
            $table->foreignIdFor(User::class)->unique()->constrained()->cascadeOnDelete();
            // The one statement row every sync of this connection extends.
            $table->foreignIdFor(BankStatement::class)->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('aspsp_name');
            $table->unsignedTinyInteger('status');
            $table->string('session_id', 64);
            // The consent's accounts in the account currency, without their full IBAN.
            $table->json('accounts');
            $table->string('account_uid', 64)->nullable();
            $table->string('account_identification_hash')->nullable();
            $table->timestamp('valid_until');
            $table->timestamp('last_synced_at')->nullable();
            $table->unsignedTinyInteger('last_error')->nullable();
            $table->timestamp('last_failed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_connections');
    }
};
