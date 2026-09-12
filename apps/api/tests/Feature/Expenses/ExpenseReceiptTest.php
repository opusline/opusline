<?php

declare(strict_types=1);

use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    Storage::fake('local');
});

test('attaches a receipt and answers with the month showing it', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-10'));

    $response = attachReceiptTo($user, $expense)
        ->assertCreated()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.receipt.fileName', 'facture-9921.pdf');

    expect($response->json('expenses.0.receipt.sizeBytes'))->toBeGreaterThan(0);
    $this->assertDatabaseHas('media', ['model_type' => 'expense', 'model_id' => $expense->id, 'collection_name' => 'receipt']);
});

test('a second upload replaces the receipt rather than piling up', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    attachReceiptTo($user, $expense, 'first.pdf')->assertCreated();
    attachReceiptTo($user, $expense, 'corrected.pdf')
        ->assertCreated()
        ->assertJsonPath('expenses.0.receipt.fileName', 'corrected.pdf');

    expect($expense->fresh()?->getMedia('receipt'))->toHaveCount(1);
});

test('rejects a file type a receipt never comes as', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    attachReceiptTo($user, $expense, UploadedFile::fake()->create('run.exe', 100, 'application/x-msdownload'))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');
});

test('rejects an oversized receipt', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    attachReceiptTo($user, $expense, UploadedFile::fake()->create('scan.pdf', 21_000, 'application/pdf'))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');
});

test('streams the receipt inline with a restrictive csp', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);
    attachReceiptTo($user, $expense)->assertCreated();

    $response = $this->actingAs($user)
        ->get("/api/expenses/{$expense->id}/receipt")
        ->assertOk()
        ->assertHeader('Content-Security-Policy', "default-src 'none'");

    expect($response->headers->get('Cache-Control'))->toContain('no-store');
});

test('answers 404 when there is no receipt to stream', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    $this->actingAs($user)->getJson("/api/expenses/{$expense->id}/receipt")->assertNotFound();
});

test('detaching an expense without a receipt is a no-op that still answers the month', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-10'));

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}/receipt")
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.receipt', null);
});

test('refuses a receipt whose name hides an executable segment, as a 422 not a crash', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    attachReceiptTo($user, $expense, 'facture.php.pdf')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');

    $this->assertDatabaseMissing('media', ['model_type' => 'expense', 'model_id' => $expense->id]);
});

test('detaches the receipt and answers with the month', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-10'));
    attachReceiptTo($user, $expense)->assertCreated();

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}/receipt")
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.receipt', null);

    $this->assertDatabaseMissing('media', ['model_type' => 'expense', 'model_id' => $expense->id]);
});

test('deleting the expense takes its receipt along', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);
    attachReceiptTo($user, $expense)->assertCreated();

    $this->actingAs($user)->deleteJson("/api/expenses/{$expense->id}")->assertNoContent();

    $this->assertDatabaseMissing('media', ['model_type' => 'expense', 'model_id' => $expense->id]);
});

test('detaching the receipt of a deducted purchase regularises it on the next open CA3', function (): void {
    freezeTodayAtUtcNoon();
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05'));
    ca3DeclaredFor($user, '2026-07');

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}/receipt")
        ->assertOk()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.isRegularisation', true);
});

test('detaching nothing from a blocked purchase in a declared month moves nothing', function (): void {
    freezeTodayAtUtcNoon();
    $user = vatLiableUser();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05'));
    ca3DeclaredFor($user, '2026-07');

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}/receipt")
        ->assertOk()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-07')
        ->assertJsonPath('expenses.0.isRegularisation', false);
});
