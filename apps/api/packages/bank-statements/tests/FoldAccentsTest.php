<?php

declare(strict_types=1);

use Opusline\BankStatements\FoldAccents;

test('folds the accents french bank labels carry', function (): void {
    expect(FoldAccents::fold('éèêëàâîïôûùüçœ'))->toBe('EEEEAAIIOUUUCOE');
});
