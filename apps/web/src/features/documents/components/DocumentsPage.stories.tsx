import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { documentGroups, personalDocuments } from "../lib/fixtures";
import { DocumentsPage } from "./documents-page";

const meta = {
  title: "Web/Documents/DocumentsPage",
  component: DocumentsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    personalDocuments: personalDocuments(),
    libraryGroups: documentGroups(),
    onUpload: async () => ({ status: "success" }) as const,
    onDelete: async () => true,
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DocumentsPage>;

export default meta;
type Story = StoryObj<typeof DocumentsPage>;

export const Default: Story = {};

export const NothingFiledYet: Story = {
  args: { personalDocuments: [], libraryGroups: [] },
};

export const OnlyPersonalPieces: Story = {
  args: { libraryGroups: [] },
};
