import type { Meta, StoryObj } from "@storybook/react";

import { DocumentsSectionHeading } from "./documents-section-heading";

const meta = {
  title: "Web/Documents/DocumentsSectionHeading",
  component: DocumentsSectionHeading,
  tags: ["autodocs"],
  args: { children: "Mes pièces administratives" },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentsSectionHeading>;

export default meta;
type Story = StoryObj<typeof DocumentsSectionHeading>;

export const Default: Story = {};

export const LibraryHeading: Story = {
  args: { children: "Reçus des clients et missions" },
};
