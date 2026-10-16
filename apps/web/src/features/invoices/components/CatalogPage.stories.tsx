import type { Meta, StoryObj } from "@storybook/react";

import { catalogFixture } from "../lib/catalog-fixture";
import { CatalogPage } from "./catalog-page";

const meta = {
  title: "Web/CatalogPage",
  component: CatalogPage,
  tags: ["autodocs"],
  args: {
    items: catalogFixture,
    vatLiable: true,
    isSaving: false,
    error: null,
    onSave: async () => true,
    onRemove: () => {},
  },
} satisfies Meta<typeof CatalogPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Under the franchise, no line carries VAT. */
export const Franchise: Story = { args: { vatLiable: false } };

export const Empty: Story = { args: { items: [] } };

export const SaveFailed: Story = {
  args: { error: "L'enregistrement a échoué. Réessayez dans un instant." },
};
