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
        Schema::create('passkeys', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->index()->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            // base64url of the credential id the authenticator chose; 512
            // characters keeps the unique index under MySQL's 3072-byte cap.
            $table->string('credential_id', 512)->unique();
            // The COSE public key, base64.
            $table->text('public_key');
            $table->unsignedBigInteger('counter')->default(0);
            $table->json('transports')->nullable();
            $table->string('aaguid', 36)->nullable();
            $table->boolean('backup_eligible')->default(false);
            $table->boolean('backed_up')->default(false);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table): void {
            // The opaque id every passkey of the account is bound to. Random
            // rather than derived from the row id: authenticators reveal it
            // to any site that asks, and it must never identify the person.
            $table->string('passkey_user_handle', 64)->nullable()->unique()->after('two_factor_recovery_codes');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('passkey_user_handle');
        });

        Schema::dropIfExists('passkeys');
    }
};
