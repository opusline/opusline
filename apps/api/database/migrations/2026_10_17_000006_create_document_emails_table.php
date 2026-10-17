<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Every e-mail sent to a client about a document: who got it, with
        // what words, when. The history a reminder is counted against.
        Schema::create('document_emails', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('quote_id')->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('kind');
            $table->json('recipients');
            $table->boolean('copy_to_sender')->default(false);
            $table->string('subject');
            $table->text('body');
            $table->timestamp('sent_at');
            $table->timestamps();

            $table->index(['user_id', 'sent_at']);
            $table->index(['invoice_id', 'sent_at']);
            $table->index(['quote_id', 'sent_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_emails');
    }
};
