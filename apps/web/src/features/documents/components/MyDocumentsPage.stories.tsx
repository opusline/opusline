import type { DocumentData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { MyDocumentsPage } from "./my-documents-page";

const meta = {
  title: "Web/MyDocumentsPage",
  component: MyDocumentsPage,
  tags: ["autodocs"],
  args: {
    downloadHref: (document) => `/api/documents/${document.id}/download`,
    onDelete: async () => true,
    onUpload: async () => ({ status: "success" }) as const,
  },
} satisfies Meta<typeof MyDocumentsPage>;

export default meta;
type Story = StoryObj<typeof MyDocumentsPage>;

const base = {
  source: 2,
  sizeBytes: 184_320,
  createdAt: "2026-07-14T09:00:00+00:00",
} satisfies Partial<DocumentData>;

export const Complete: Story = {
  args: {
    documents: [
      { ...base, id: 1, fileName: "kbis.pdf", category: 6 },
      { ...base, id: 2, fileName: "attestation-urssaf.pdf", category: 7 },
      { ...base, id: 3, fileName: "rc-pro.pdf", category: 8 },
      { ...base, id: 4, fileName: "rib.pdf", category: 9 },
    ],
  },
};

/** What most accounts look like: a couple of pieces filed, the rest nagging. */
export const Incomplete: Story = {
  args: {
    documents: [
      { ...base, id: 1, fileName: "kbis.pdf", category: 6 },
      { ...base, id: 2, fileName: "rib.pdf", category: 9 },
    ],
  },
};

export const Empty: Story = {
  args: {
    documents: [],
  },
};
