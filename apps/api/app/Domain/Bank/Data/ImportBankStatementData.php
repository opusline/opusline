<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Enums\Currency;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class ImportBankStatementData extends Data
{
    public function __construct(
        /**
         * The statement exported from the bank. No Mimes() rule on purpose: OFX
         * and QIF sniff as text/plain, so a mime list either rejects valid files
         * or admits any text — the parser's content sniffing is the real gate.
         */
        #[File, Max(10240), Rule('extensions:csv,tsv,txt,ofx,qif,xml')]
        public UploadedFile $file,
        /**
         * The balance read on the bank at the statement date, in signed cents.
         * Flat scalars rather than a nested money object: multipart cannot
         * carry nested fields. When given, it beats the file's own ledger
         * balance as the account's balance anchor.
         */
        #[IntegerType, RequiredWith('balanceCurrency')]
        public ?int $balanceAmount = null,
        #[RequiredWith('balanceAmount'), Rule(new AccountCurrency)]
        public ?Currency $balanceCurrency = null,
    ) {}
}
