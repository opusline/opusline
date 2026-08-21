import type { DocumentData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  isClientDocument,
  PERSONAL_DOCUMENT_CATEGORIES,
} from "@/lib/documents";
import { DocumentsTab } from "./documents-tab";

const documents: DocumentData[] = [
  {
    id: 1,
    fileName: "contrat-cadre-nordlys-2025.pdf",
    category: 0,
    source: 1,
    sizeBytes: 1_240_000,
    createdAt: "2025-03-05T10:00:00+00:00",
  },
  {
    id: 2,
    fileName: "devis-callisto-front.pdf",
    category: 1,
    source: 0,
    sizeBytes: 845_000,
    createdAt: "2025-03-12T10:00:00+00:00",
  },
  {
    id: 3,
    fileName: "cra-mars-2025-signe.pdf",
    category: 2,
    source: 0,
    sizeBytes: 312_000,
    createdAt: "2025-04-02T10:00:00+00:00",
  },
  {
    id: 4,
    fileName: "notes-cadrage.docx",
    category: 4,
    source: 0,
    sizeBytes: 96_000,
    createdAt: "2025-03-20T10:00:00+00:00",
  },
];

const meta = {
  title: "Web/DocumentsTab",
  component: DocumentsTab,
  tags: ["autodocs"],
} satisfies Meta<typeof DocumentsTab>;

export default meta;
type Story = StoryObj<typeof DocumentsTab>;

export const Default: Story = {
  args: {
    documents,
    emptyLabel: "Aucun document pour ce client.",
    onUpload: async () => ({ status: "success" }) as const,
    onDelete: async () => true,
    downloadHref: () => "#",
  },
};

export const OnAMission: Story = {
  args: {
    ...Default.args,
    emptyLabel: "Aucun document pour cette mission.",
    showSourceBadge: true,
    canRemove: (document) => !isClientDocument(document),
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    documents: [],
  },
};

export const UploadFails: Story = {
  args: {
    ...Default.args,
    documents: [],
    onUpload: async () => ({
      status: "failed",
      message: "L'envoi a échoué. Réessayez dans un instant.",
    }),
  },
};

export const SlowUpload: Story = {
  args: {
    ...Default.args,
    documents: [],
    onUpload: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return { status: "success" } as const;
    },
  },
};

/**
 * The freelance's own administrative pieces use their own vocabulary: the type
 * select offers Kbis, attestation, assurance, RIB and CGV instead of the
 * contract/quote/CRA set a client fiche shows.
 */
export const PersonalPieces: Story = {
  args: {
    ...Default.args,
    assignableCategories: PERSONAL_DOCUMENT_CATEGORIES,
    emptyLabel: "Aucune pièce administrative pour l'instant.",
    documents: [
      {
        id: 1,
        fileName: "avis-de-situation-sirene.pdf",
        category: 6,
        source: 2,
        sizeBytes: 90_112,
        createdAt: "2026-01-14T09:12:00+00:00",
      },
      {
        id: 2,
        fileName: "attestation-vigilance-t2-2026.pdf",
        category: 7,
        source: 2,
        sizeBytes: 98_304,
        createdAt: "2026-05-02T08:30:00+00:00",
      },
      {
        id: 3,
        fileName: "cgv-2026.pdf",
        category: 10,
        source: 2,
        sizeBytes: 167_936,
        createdAt: "2026-01-11T16:20:00+00:00",
      },
    ],
  },
};
