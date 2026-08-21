import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { documentGroup, documentGroups } from "../lib/fixtures";
import { DocumentGroup } from "./document-group";

const meta = {
  title: "Web/Documents/DocumentGroup",
  component: DocumentGroup,
  tags: ["autodocs"],
  args: { group: documentGroup(), isOpen: false, onToggle: () => {} },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-3xl p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DocumentGroup>;

export default meta;
type Story = StoryObj<typeof DocumentGroup>;

export const Collapsed: Story = {};

export const Expanded: Story = {
  args: { isOpen: true },
};

export const MissionExpanded: Story = {
  args: { group: documentGroups()[0], isOpen: true },
};
