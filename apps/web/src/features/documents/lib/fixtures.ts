import type { DocumentData, DocumentGroupData } from "@opusline/api-client";

export function personalDocument(
  overrides: Partial<DocumentData> = {},
): DocumentData {
  return {
    id: 1,
    fileName: "avis-de-situation-sirene.pdf",
    category: 6,
    source: 2,
    sizeBytes: 90_112,
    createdAt: "2026-01-14T09:12:00+00:00",
    ...overrides,
  };
}

export function personalDocuments(): DocumentData[] {
  return [
    personalDocument(),
    personalDocument({
      id: 2,
      fileName: "attestation-vigilance-t2-2026.pdf",
      category: 7,
      sizeBytes: 98_304,
      createdAt: "2026-05-02T08:30:00+00:00",
    }),
    personalDocument({
      id: 3,
      fileName: "rc-pro-2026.pdf",
      category: 8,
      sizeBytes: 294_912,
      createdAt: "2026-01-08T14:05:00+00:00",
    }),
    personalDocument({
      id: 4,
      fileName: "rib-perso.pdf",
      category: 9,
      sizeBytes: 43_008,
      createdAt: "2025-02-03T11:45:00+00:00",
    }),
    personalDocument({
      id: 5,
      fileName: "cgv-2026.pdf",
      category: 10,
      sizeBytes: 167_936,
      createdAt: "2026-01-11T16:20:00+00:00",
    }),
  ];
}

export function documentGroup(
  overrides: Partial<DocumentGroupData> = {},
): DocumentGroupData {
  return {
    name: "Nordlys",
    color: 3,
    clientName: "Nordlys",
    clientSlug: "nordlys",
    missionSlug: null,
    lastAddedAt: "2026-03-12T10:00:00+00:00",
    documents: [
      {
        id: 11,
        fileName: "contrat-cadre-nordlys-2026.pdf",
        category: 0,
        source: 1,
        sizeBytes: 421_888,
        createdAt: "2026-03-12T10:00:00+00:00",
      },
    ],
    ...overrides,
  };
}

export function documentGroups(): DocumentGroupData[] {
  return [
    documentGroup({
      name: "Refonte portail",
      color: 6,
      clientName: "Nordlys",
      clientSlug: "nordlys",
      missionSlug: "refonte-portail",
      lastAddedAt: "2026-07-31T17:00:00+00:00",
      documents: [
        {
          id: 21,
          fileName: "cra-juillet-2026-signe.pdf",
          category: 2,
          source: 0,
          sizeBytes: 88_064,
          createdAt: "2026-07-31T17:00:00+00:00",
        },
        {
          id: 22,
          fileName: "devis-refonte-portail.pdf",
          category: 1,
          source: 0,
          sizeBytes: 132_096,
          createdAt: "2026-02-18T09:00:00+00:00",
        },
      ],
    }),
    documentGroup(),
    documentGroup({
      name: "Callisto",
      color: 1,
      clientName: "Callisto",
      clientSlug: "callisto",
      lastAddedAt: "2026-06-04T08:00:00+00:00",
      documents: [
        {
          id: 31,
          fileName: "facture-callisto-2026-041.pdf",
          category: 3,
          source: 1,
          sizeBytes: 76_800,
          createdAt: "2026-06-04T08:00:00+00:00",
        },
      ],
    }),
  ];
}
