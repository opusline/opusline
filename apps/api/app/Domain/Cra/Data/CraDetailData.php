<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Missions\Data\MissionData;
use Spatie\LaravelData\Data;

class CraDetailData extends Data
{
    public function __construct(
        public CraData $cra,
        public ClientData $client,
        public MissionData $mission,
        /**
         * Who the document is addressed to: the end client when the mission runs
         * through an ESN, the billing client otherwise.
         */
        public string $recipientName,
    ) {}
}
