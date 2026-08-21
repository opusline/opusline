import type { DocumentData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react";
import { Trash2Icon } from "lucide-react";

import { DocumentDownloadButton, DocumentRow } from "./document-row";

const document: DocumentData = {
  id: 1,
  fileName: "contrat-cadre-nordlys-2026.pdf",
  category: 0,
  source: 1,
  sizeBytes: 421_888,
  createdAt: "2026-03-12T10:00:00+00:00",
};

const meta = {
  title: "Web/DocumentRow",
  component: DocumentRow,
  tags: ["autodocs"],
  args: {
    document,
    children: <DocumentDownloadButton document={document} href="#" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl overflow-hidden rounded-md border bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentRow>;

export default meta;
type Story = StoryObj<typeof DocumentRow>;

export const Default: Story = {};

export const WithBadgeAndDelete: Story = {
  args: {
    badges: <Badge variant="quiet">client</Badge>,
    children: (
      <>
        <DocumentDownloadButton document={document} href="#" />
        <Button aria-label="Supprimer" size="icon-lg" variant="ghost">
          <Trash2Icon aria-hidden />
        </Button>
      </>
    ),
  },
};
