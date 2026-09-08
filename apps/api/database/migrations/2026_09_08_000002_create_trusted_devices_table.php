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
        Schema::create('trusted_devices', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->index()->constrained()->cascadeOnDelete();
            // SHA-256 of the token the browser holds; the clear token exists
            // only in the cookie.
            $table->char('token_hash', 64)->unique();
            $table->string('user_agent', 512)->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestamp('last_used_at')->nullable();
            // The cookie carries the same horizon, but the row is the control:
            // a copied cookie stops working when the row expires or is revoked.
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trusted_devices');
    }
};
