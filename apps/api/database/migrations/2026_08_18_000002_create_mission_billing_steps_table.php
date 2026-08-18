<?php

declare(strict_types=1);

use App\Domain\Invoices\Models\Invoice;
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
        Schema::create('mission_billing_steps', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Mission::class)->constrained()->cascadeOnDelete();
            $table->string('label');
            // Currency must precede amount_cents: MoneyIntegerCast reads it to
            // build the amount, the same order missions and invoices rely on.
            $table->char('currency', 3)->default(Currency::EUR->value);
            $table->unsignedBigInteger('amount_cents');
            $table->unsignedTinyInteger('position');

            // A step is due when the calendar says so, when you say so, or both.
            // A milestone is really a project event ("staging is up"), which no
            // date can predict — but a date is what makes it chase you without
            // being told, so the schedule accepts either trigger.
            $table->date('due_on')->nullable();
            $table->timestamp('ready_at')->nullable();

            $table->foreignIdFor(Invoice::class)->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->unique(['mission_id', 'position']);
            // The one hot read filters on the account, then on steps not yet
            // billed, then on the date — invoice_id has to sit between the two or
            // the index walks every settled step of the account and drops it.
            $table->index(['user_id', 'invoice_id', 'due_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mission_billing_steps');
    }
};
