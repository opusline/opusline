<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->string('billing_address_line1')->nullable()->after('vat_number');
            $table->string('billing_address_line2')->nullable()->after('billing_address_line1');
            $table->string('billing_postal_code', 32)->nullable()->after('billing_address_line2');
            $table->string('billing_city')->nullable()->after('billing_postal_code');
            $table->string('billing_country')->nullable()->after('billing_city');
        });

        $this->carryOverFreeTextAddresses();

        Schema::table('clients', function (Blueprint $table): void {
            $table->dropColumn('billing_address');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table): void {
            $table->text('billing_address')->nullable()->after('vat_number');
        });

        DB::table('clients')
            ->whereNotNull('billing_address_line1')
            ->orWhereNotNull('billing_city')
            ->update([
                'billing_address' => DB::raw(
                    "trim(coalesce(billing_address_line1, '') || char(10) || ".
                    "coalesce(billing_postal_code, '') || ' ' || coalesce(billing_city, ''))"
                ),
            ]);

        Schema::table('clients', function (Blueprint $table): void {
            $table->dropColumn([
                'billing_address_line1',
                'billing_address_line2',
                'billing_postal_code',
                'billing_city',
                'billing_country',
            ]);
        });
    }

    private function carryOverFreeTextAddresses(): void
    {
        DB::table('clients')
            ->whereNotNull('billing_address')
            ->orderBy('id')
            ->each(function (object $client): void {
                /** @var string $raw */
                $raw = $client->billing_address;
                $lines = array_values(array_filter(array_map(trim(...), preg_split('/\R/', $raw) ?: [])));

                if ($lines === []) {
                    return;
                }

                $update = [];
                $last = end($lines);

                if (count($lines) > 1 && preg_match('/^(\d{5})\s+(.+)$/u', (string) $last, $matches) === 1) {
                    array_pop($lines);
                    $update['billing_postal_code'] = $matches[1];
                    $update['billing_city'] = $matches[2];
                }

                $update['billing_address_line1'] = array_shift($lines);
                $update['billing_address_line2'] = $lines === [] ? null : implode(', ', $lines);

                DB::table('clients')->where('id', $client->id)->update($update);
            });
    }
};
