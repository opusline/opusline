<?php

declare(strict_types=1);

return [
    'end_client_required_for_intermediary' => 'An end client name is required when the billing client is an intermediary.',
    'end_client_only_for_intermediary' => 'An end client name can only be set when the billing client is an intermediary.',
    'rate_forbidden_for_internal' => 'Missions for an internal client are not billable.',
    'rounding_forbidden_for_fixed' => 'Rounding does not apply to fixed-price missions.',
    'cra_forbidden_for_hourly' => 'A CRA counts days: it does not apply to a mission billed by the hour.',
    'cannot_delete_with_time_entries' => 'Cannot delete a mission that still has time entries. Delete them first.',
    'cannot_delete_with_running_timer' => 'Cannot delete a mission with a running timer. Stop it first.',
    'cannot_delete_with_cras' => 'Cannot delete a mission that has activity reports. Delete them first.',
    'cannot_leave_daily_billing_with_cras' => 'This mission has activity reports: it can no longer move to hourly billing.',
    'billing_mode_immutable_with_entries' => 'This mission has tracked time: its billing mode can no longer change. A new contract is a new mission.',
];
