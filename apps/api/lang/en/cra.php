<?php

declare(strict_types=1);

return [
    'mission_does_not_require_one' => 'That mission does not call for an activity report.',
    'mission_is_not_billed_by_the_day' => 'A CRA counts days: it does not apply to a mission billed by the hour.',
    'month_is_in_the_future' => 'A month that has not started yet cannot be reported on.',
    'already_exists' => 'A CRA already exists for that mission and month.',
    'already_issued' => 'This CRA is already with the client: its days can no longer change.',
    'changed_while_sending' => 'The grid changed while the document was being prepared: nothing was sent. Check the days, then send again.',
    'day_outside_month' => 'That day is not part of the CRA\'s month.',
    'day_listed_twice' => 'That day appears twice in the grid.',
    'nothing_to_send' => 'This CRA reports no day at all: fill the grid before sending it.',
    'only_a_sent_cra_reopens' => 'Only a sent CRA can be reopened.',
    'signed_return_filed' => 'The signed return is already filed: this CRA can no longer be reopened.',
    'only_a_sent_cra_is_returned' => 'A signed return belongs only on a sent CRA.',
];
