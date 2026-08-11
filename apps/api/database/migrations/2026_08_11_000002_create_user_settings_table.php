<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_settings', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->unique()->constrained()->cascadeOnDelete();

            $table->string('trade_name')->nullable();
            $table->string('siret')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('signature_city')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('phone', 64)->nullable();

            $table->string('company_address_line1')->nullable();
            $table->string('company_address_line2')->nullable();
            $table->string('company_postal_code', 32)->nullable();
            $table->string('company_city')->nullable();

            $table->boolean('home_address_same_as_company')->default(true);
            $table->string('home_address_line1')->nullable();
            $table->string('home_address_line2')->nullable();
            $table->string('home_postal_code', 32)->nullable();
            $table->string('home_city')->nullable();

            $table->unsignedTinyInteger('urssaf_periodicity')->default(UrssafPeriodicity::Monthly->value);
            // Rates are exact integer basis points — 26,00 % is 2600. Never a float.
            $table->unsignedInteger('contribution_rate_bp')->default(2600);
            $table->boolean('liberating_payment')->default(false);
            $table->unsignedInteger('liberating_payment_rate_bp')->default(220);
            $table->unsignedTinyInteger('vat_regime')->default(VatRegime::FranchiseEnBase->value);

            $table->unsignedSmallInteger('default_payment_terms_days')->default(45);
            $table->string('invoice_number_format', 64)->default('AAAA-NNN');
            $table->unsignedBigInteger('treasury_buffer_cents')->nullable();
            $table->char('currency', 3)->default(Currency::EUR->value);

            $table->timestamps();
        });

        $now = now();

        DB::table('users')
            ->select('id')
            ->orderBy('id')
            ->chunk(500, function (Collection $users) use ($now): void {
                DB::table('user_settings')->insert(
                    $users->map(fn (object $user): array => [
                        'user_id' => $user->id,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ])->all(),
                );
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
