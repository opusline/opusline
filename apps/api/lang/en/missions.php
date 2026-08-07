<?php

declare(strict_types=1);

return [
    'end_client_required_for_intermediary' => 'An end client name is required when the billing client is an intermediary.',
    'end_client_only_for_intermediary' => 'An end client name can only be set when the billing client is an intermediary.',
    'rate_forbidden_for_internal' => 'Missions for an internal client are not billable.',
    'rounding_forbidden_for_fixed' => 'Rounding does not apply to fixed-price missions.',
    'cannot_delete_with_time_entries' => 'Cannot delete a mission that still has time entries. Delete them first.',
];
