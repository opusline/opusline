<?php

declare(strict_types=1);

return [
    'relay_blocked' => 'This instance can no longer send reports.',
    'relay_proof_refused' => 'The report\'s proof of work was refused: ask for a new challenge and solve it again.',
    'relay_github_failed' => 'GitHub refused the report for now. Try again in a few minutes.',
    'report_relay_busy' => 'Too many reports were sent from this instance recently. Try again in an hour.',
    'report_not_delivered' => 'The report could not be sent. Try again in a few minutes; nothing was filed.',
    'conversation_needs_key' => 'Add an Anthropic key under Settings › Integrations to draft a report with Claude.',
    'conversation_out_of_turn' => 'The conversation must alternate, starting and ending with you.',
    'conversation_unavailable' => 'Claude could not be reached. Try again in a few minutes, or fill in the form yourself.',
    'conversation_failed' => 'Claude did not answer usably. Try again, or fill in the form yourself.',
];
