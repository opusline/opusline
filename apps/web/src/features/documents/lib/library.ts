import type { DocumentData, DocumentGroupData } from "@opusline/api-client";

import {
  clientDocumentDownloadHref,
  type DocumentCategoryFilter,
  foldAccents,
  matchesDocumentSearch,
  missionDocumentDownloadHref,
} from "@/lib/documents";
import { m } from "@/paraglide/messages.js";

export type LibraryHit = {
  group: DocumentGroupData;
  document: DocumentData;
};

type MissionGroup = DocumentGroupData & { missionSlug: string };

export function isMissionGroup(
  group: DocumentGroupData,
): group is MissionGroup {
  return group.missionSlug !== null;
}

export function groupKey(group: DocumentGroupData): string {
  return isMissionGroup(group)
    ? `mission:${group.clientSlug}/${group.missionSlug}`
    : `client:${group.clientSlug}`;
}

export function groupKindLabel(group: DocumentGroupData): string {
  return isMissionGroup(group)
    ? m.documents_owner_mission()
    : m.documents_owner_client();
}

export function libraryDownloadHref(
  group: DocumentGroupData,
  document: DocumentData,
): string {
  return isMissionGroup(group)
    ? missionDocumentDownloadHref(group.clientSlug, group.missionSlug, document)
    : clientDocumentDownloadHref(group.clientSlug, document.id);
}

export function libraryDocuments(groups: DocumentGroupData[]): DocumentData[] {
  return groups.flatMap((group) => group.documents);
}

export function filterGroups(
  groups: DocumentGroupData[],
  filter: DocumentCategoryFilter,
): DocumentGroupData[] {
  if (filter === "all") {
    return groups;
  }

  return groups
    .map((group) => ({
      ...group,
      documents: group.documents.filter(
        (document) => document.category === filter,
      ),
    }))
    .filter((group) => group.documents.length > 0);
}

/**
 * A search matches the file name, its type and the fiche it sits on — a mission also
 * by its client's name, so typing a client reaches every piece filed under it without
 * expanding a single group.
 */
export function searchLibrary(
  groups: DocumentGroupData[],
  search: string,
): LibraryHit[] {
  const needle = foldAccents(search.trim().toLowerCase());

  if (needle === "") {
    return [];
  }

  return groups
    .flatMap((group) => {
      const fiche = foldAccents(
        `${group.name} ${group.clientName}`.toLowerCase(),
      );

      return group.documents
        .filter(
          (document) =>
            fiche.includes(needle) || matchesDocumentSearch(document, needle),
        )
        .map((document) => ({
          group,
          document,
          at: Date.parse(document.createdAt),
        }));
    })
    .sort((left, right) => right.at - left.at)
    .map(({ group, document }) => ({ group, document }));
}
