<?php

declare(strict_types=1);

return [
    'mixed_months' => 'Select expenses from a single month.',
    'unknown_expense' => 'One of the selected expenses does not exist.',
    'vat_locked' => 'This purchase carries no TVA to defer.',
    'vat_already_declared' => 'This deduction was already filed on a declared CA3.',
    'unknown_subscription' => 'This subscription does not exist.',
    'occurrence_taken' => 'This subscription already has an expense for that period.',
    'link_on_create_only' => 'An expense is tied to a subscription when it is recorded, not afterwards.',
    'one_subscription_link' => 'Tie the purchase to an existing subscription or make it recurring, not both.',
    'unknown_movement' => 'This debit does not exist on the compte pro.',
    'movement_taken' => 'This debit already pays an invoice or another expense.',
];
