<?php

declare(strict_types=1);

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
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->boolean('auto_rates')->default(true)->after('urssaf_periodicity');
            $table->timestamp('rates_checked_at')->nullable()->after('auto_rates');
            $table->unsignedSmallInteger('rates_year')->nullable()->after('rates_checked_at');
            $table->boolean('acre')->default(false)->after('rates_year');
            $table->date('business_started_on')->nullable()->after('acre');

            $table->unsignedInteger('contribution_rate_bp')
                ->default(config()->integer('fiscality.contribution_rate_bp'))
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn([
                'auto_rates',
                'rates_checked_at',
                'rates_year',
                'acre',
                'business_started_on',
            ]);

            $table->unsignedInteger('contribution_rate_bp')->default(2600)->change();
        });
    }
};
