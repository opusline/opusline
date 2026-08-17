<?php

declare(strict_types=1);

use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A record that a return was filed. Opusline files nothing itself — this is
     * the freelancer ticking off a period they declared on impots.gouv.fr or
     * urssaf.fr, so the ledger stops asking for it.
     */
    public function up(): void
    {
        Schema::create('fiscal_declarations', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('kind');
            // `Y-m` for a month, `Y-Qn` for a quarter — the same period keys the
            // deadline list uses, so the two line up without a join table.
            $table->string('period', 7);
            $table->date('filed_on');
            /**
             * What was actually declared, which is not always what Opusline
             * computed: a correction, a rounding on the form, or a figure the
             * accountant adjusted. Null when the user just ticks it off.
             */
            $table->unsignedBigInteger('declared_amount_cents')->nullable();
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->timestamps();

            // One filing per period per kind; re-filing corrects it in place.
            $table->unique(['user_id', 'kind', 'period']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fiscal_declarations');
    }
};
