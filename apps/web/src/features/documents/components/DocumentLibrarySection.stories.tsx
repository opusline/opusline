import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { documentGroups } from "../lib/fixtures";
import { DocumentLibrarySection } from "./document-library-section";

const meta = {
  title: "Web/Documents/DocumentLibrarySection",
  component: DocumentLibrarySection,
  tags: ["autodocs"],
  args: { groups: documentGroups() },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-5xl p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DocumentLibrarySection>;

export default meta;
type Story = StoryObj<typeof DocumentLibrarySection>;

export const Default: Story = {};

export const Empty: Story = {
  args: { groups: [] },
};
