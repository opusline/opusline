<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->string('locale', 5)
                ->default(Locale::fr_FR->value)
                ->after('currency');
            $table->unsignedTinyInteger('date_format')
                ->default(DateFormat::DayMonthYear->value)
                ->after('locale');
        });
    }

    public function down(): void
    {
        Schema::table('user_settings', function (Blueprint $table): void {
            $table->dropColumn(['locale', 'date_format']);
        });
    }
};
