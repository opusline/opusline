<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use App\Domain\Users\Models\User;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\UploadedFile;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** A real PDF with a text layer, the way a supplier's billing tool would emit one. */
function receiptPdf(string $html): UploadedFile
{
    $options = new Options;
    $options->setIsRemoteEnabled(false);
    $options->setFontDir(storage_path('framework/testing/dompdf'));
    $options->setFontCache(storage_path('framework/testing/dompdf'));

    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->render();

    return UploadedFile::fake()->createWithContent('facture.pdf', (string) $dompdf->output());
}

function readReceiptAs(User $user, UploadedFile $file): TestResponse
{
    return test()->actingAs($user)->post('/api/expenses/receipt-reading', ['file' => $file], ['Accept' => 'application/json']);
}

test('reads the fields off a PDF receipt without storing anything', function (): void {
    $user = User::factory()->create();

    readReceiptAs($user, receiptPdf(<<<'HTML'
        <h1>Nordlys Cloud SAS</h1>
        <p>12 rue des Fjords, 75011 Paris</p>
        <p>Facture F-2026-0412</p>
        <p>Date de facture : 12/08/2026</p>
        <table>
            <tr><td>Hébergement VPS Pro · août 2026</td><td>35,00 €</td></tr>
            <tr><td>Total HT</td><td>35,00 €</td></tr>
            <tr><td>TVA 20 %</td><td>7,00 €</td></tr>
            <tr><td>Total TTC</td><td>42,00 €</td></tr>
        </table>
        HTML))
        ->assertOk()
        ->assertJsonPath('textFound', true)
        ->assertJsonPath('supplier.value', 'Nordlys Cloud SAS')
        ->assertJsonPath('spentOn.value', '2026-08-12')
        ->assertJsonPath('spentOn.confidence', ReceiptFieldConfidence::High->value)
        ->assertJsonPath('amountTtc.value.amount', 4_200)
        ->assertJsonPath('amountTtc.value.currency', 'EUR')
        ->assertJsonPath('vat.treatment', ExpenseVatTreatment::Domestic->value)
        ->assertJsonPath('vat.rateBp', 2_000)
        ->assertJsonPath('category', ExpenseCategory::Hosting->value);

    expect($user->expenses()->count())->toBe(0);
});

test('reads amounts in the account currency', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['currency' => 'CHF']);

    readReceiptAs($user, receiptPdf('<p>Lunaprint</p><p>Total TTC 120.00</p>'))
        ->assertOk()
        ->assertJsonPath('amountTtc.value.amount', 12_000)
        ->assertJsonPath('amountTtc.value.currency', 'CHF');
});

test('an image has no text to read', function (): void {
    readReceiptAs(User::factory()->create(), UploadedFile::fake()->image('ticket.png'))
        ->assertOk()
        ->assertExactJson(['textFound' => false, 'supplier' => null, 'spentOn' => null, 'amountTtc' => null, 'vat' => null, 'description' => null, 'category' => null]);
});

test('a damaged PDF reads as nothing rather than failing', function (): void {
    readReceiptAs(User::factory()->create(), UploadedFile::fake()->createWithContent('scan.pdf', '%PDF-1.4 nothing a parser could open'))
        ->assertOk()
        ->assertJsonPath('textFound', false);
});

test('a PDF above ten megabytes is not even opened', function (): void {
    $readable = receiptPdf('<p>Lunaprint</p><p>Total TTC 120,00 €</p>')->getContent();
    $padded = $readable.str_repeat("%\n", intdiv(10 * 1024 * 1024, 2) + 1);

    readReceiptAs(User::factory()->create(), UploadedFile::fake()->createWithContent('scan.pdf', $padded))
        ->assertOk()
        ->assertJsonPath('textFound', false);
});

test('reads the first three pages only', function (): void {
    $page = '<p style="page-break-after:always">Lunaprint · page</p>';

    readReceiptAs(User::factory()->create(), receiptPdf($page.$page.$page.'<p>Total TTC 120,00 €</p>'))
        ->assertOk()
        ->assertJsonPath('textFound', true)
        ->assertJsonPath('amountTtc', null);
});

test('reads the file by its content, not its name', function (): void {
    $pdf = receiptPdf('<p>Lunaprint</p><p>Total TTC 120,00 €</p>')->getContent();

    readReceiptAs(User::factory()->create(), UploadedFile::fake()->createWithContent('FACTURE.PDF', $pdf))
        ->assertOk()
        ->assertJsonPath('amountTtc.value.amount', 12_000);
});

test('refuses anything but a receipt file', function (): void {
    readReceiptAs(User::factory()->create(), UploadedFile::fake()->create('run.exe', 100, 'application/x-msdownload'))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['file']);
});

test('requires a signed-in user', function (): void {
    $this->post('/api/expenses/receipt-reading', ['file' => UploadedFile::fake()->image('ticket.png')], ['Accept' => 'application/json'])
        ->assertUnauthorized();
});

test('spends the upload quota', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 20) as $attempt) {
        readReceiptAs($user, UploadedFile::fake()->image('ticket.png'))->assertOk();
    }

    readReceiptAs($user, UploadedFile::fake()->image('ticket.png'))->assertStatus(429);
});
