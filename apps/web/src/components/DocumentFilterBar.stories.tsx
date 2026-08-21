import type { DocumentData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { countByCategory, type DocumentCategoryFilter } from "@/lib/documents";

import { DocumentFilterBar } from "./document-filter-bar";

const documents: DocumentData[] = [
  {
    id: 1,
    fileName: "contrat-cadre-nordlys-2026.pdf",
    category: 0,
    source: 1,
    sizeBytes: 421_888,
    createdAt: "2026-03-12T10:00:00+00:00",
  },
  {
    id: 2,
    fileName: "devis-callisto-front.pdf",
    category: 1,
    source: 0,
    sizeBytes: 132_096,
    createdAt: "2026-02-18T09:00:00+00:00",
  },
  {
    id: 3,
    fileName: "cra-juillet-2026-signe.pdf",
    category: 2,
    source: 0,
    sizeBytes: 88_064,
    createdAt: "2026-07-31T17:00:00+00:00",
  },
];

function Example({ searchPlaceholder }: { searchPlaceholder: string }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DocumentCategoryFilter>("all");

  return (
    <DocumentFilterBar
      counts={countByCategory(documents)}
      filter={filter}
      onFilterChange={setFilter}
      onSearchChange={setSearch}
      search={search}
      searchPlaceholder={searchPlaceholder}
      total={documents.length}
    />
  );
}

const meta = {
  title: "Web/DocumentFilterBar",
  component: Example,
  tags: ["autodocs"],
  args: { searchPlaceholder: "Rechercher" },
  decorators: [
    (Story) => (
      <div className="max-w-4xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {};

export const LibraryPlaceholder: Story = {
  args: { searchPlaceholder: "Rechercher un document" },
};
