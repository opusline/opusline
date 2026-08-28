<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;

/**
 * `foreignIdFor(...)->constrained()` creates the column and the constraint but no
 * index. InnoDB adds one behind your back; Postgres and SQLite do not, and the
 * CI matrix runs all three.
 *
 * A restrictive constraint makes it worse than a slow read: every delete of a
 * parent row has to prove no child references it.
 */
test('every foreign key column leads some index', function (): void {
    $uncovered = [];

    foreach (Schema::getTableListing(schemaQualified: false) as $table) {
        $leadingColumns = collect(Schema::getIndexes($table))
            ->map(fn (array $index): ?string => $index['columns'][0] ?? null)
            ->filter()
            ->all();

        foreach (Schema::getForeignKeys($table) as $foreignKey) {
            $column = $foreignKey['columns'][0];

            if (! in_array($column, $leadingColumns, true)) {
                $uncovered[] = $table.'.'.$column;
            }
        }
    }

    sort($uncovered);

    expect($uncovered)->toBe(
        [],
        'These foreign keys have no index leading with them, so Postgres and SQLite '
        .'scan the whole child table to enforce the constraint. Add an index in a '
        .'migration — a composite one led by the column counts.',
    );
});
