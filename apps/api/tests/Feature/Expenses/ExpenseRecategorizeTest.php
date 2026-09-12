<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('moves the selected expenses to a category and answers with the shown month', function (): void {
    $user = User::factory()->create();
    $first = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-03'));
    $second = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-09'));
    $untouched = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-11'));

    $this->actingAs($user)
        ->postJson('/api/expenses/category', [
            'expenseIds' => [$first->id, $second->id],
            'category' => ExpenseCategory::Internet->value,
        ])
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.id', $untouched->id)
        ->assertJsonPath('expenses.0.category', ExpenseCategory::Phone->value)
        ->assertJsonPath('expenses.1.category', ExpenseCategory::Internet->value)
        ->assertJsonPath('expenses.2.category', ExpenseCategory::Internet->value);
});

test('refuses an expense of another account', function (): void {
    $foreign = expenseOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->postJson('/api/expenses/category', [
            'expenseIds' => [$foreign->id],
            'category' => ExpenseCategory::Internet->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');

    $this->assertDatabaseHas('expenses', ['id' => $foreign->id, 'category' => ExpenseCategory::Phone->value]);
});

test('refuses a selection that is not a flat list of ids', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/expenses/category', [
            'expenseIds' => [[1], [2]],
            'category' => ExpenseCategory::Internet->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds.0');
});

test('refuses an empty selection', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/expenses/category', [
            'expenseIds' => [],
            'category' => ExpenseCategory::Internet->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');
});

test('refuses a body without a selection rather than failing later', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/expenses/category', ['category' => ExpenseCategory::Internet->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');
});

test('refuses a selection that spans several months', function (): void {
    $user = User::factory()->create();
    $july = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-30'));
    $august = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-02'));

    $this->actingAs($user)
        ->postJson('/api/expenses/category', [
            'expenseIds' => [$july->id, $august->id],
            'category' => ExpenseCategory::Internet->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');

    $this->assertDatabaseHas('expenses', ['id' => $july->id, 'category' => ExpenseCategory::Phone->value]);
});
