<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Data\DocumentData;
use App\Domain\Documents\Data\DocumentGroupData;
use App\Domain\Documents\Data\DocumentLibraryData;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Every document the user received on a client or a mission, grouped by the fiche it
 * hangs on.
 *
 * A client's documents stay in the client's own group. The mission fiche deliberately
 * merges them into its own list — inherited pieces belong there — but repeating them
 * under every mission here would count the same file several times.
 */
class ListDocumentLibrary
{
    public function handle(User $user): DocumentLibraryData
    {
        $groups = [];

        foreach ($user->clients()->with('documents')->get() as $client) {
            if ($client->documents->isNotEmpty()) {
                $groups[] = $this->clientGroup($client);
            }
        }

        foreach ($user->missions()->with(['client', 'documents'])->get() as $mission) {
            if ($mission->documents->isNotEmpty()) {
                $groups[] = $this->missionGroup($mission);
            }
        }

        usort(
            $groups,
            fn (DocumentGroupData $left, DocumentGroupData $right): int => count($right->documents) <=> count($left->documents)
                ?: strcasecmp($left->name, $right->name),
        );

        return new DocumentLibraryData(groups: $groups);
    }

    private function clientGroup(Client $client): DocumentGroupData
    {
        $documents = $this->documents($client->documents);

        return new DocumentGroupData(
            name: $client->name,
            color: $client->color,
            clientName: $client->name,
            clientSlug: $client->slug,
            missionSlug: null,
            lastAddedAt: $documents[0]->createdAt,
            documents: $documents,
        );
    }

    private function missionGroup(Mission $mission): DocumentGroupData
    {
        $documents = $this->documents($mission->documents);

        return new DocumentGroupData(
            name: $mission->name,
            color: $mission->effectiveColor(),
            clientName: $mission->client->name,
            clientSlug: $mission->client->slug,
            missionSlug: $mission->slug,
            lastAddedAt: $documents[0]->createdAt,
            documents: $documents,
        );
    }

    /**
     * @param  Collection<int, Media>  $media
     * @return non-empty-list<DocumentData>
     */
    private function documents(Collection $media): array
    {
        /** @var non-empty-list<DocumentData> */
        return array_map(DocumentData::fromMedia(...), $media->all());
    }
}
