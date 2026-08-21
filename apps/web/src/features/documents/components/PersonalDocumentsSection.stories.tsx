import type { Meta, StoryObj } from "@storybook/react";

import { personalDocuments } from "../lib/fixtures";
import { PersonalDocumentsSection } from "./personal-documents-section";

const meta = {
  title: "Web/Documents/PersonalDocumentsSection",
  component: PersonalDocumentsSection,
  tags: ["autodocs"],
  args: {
    documents: personalDocuments(),
    onUpload: async () => ({ status: "success" }) as const,
    onDelete: async () => true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-5xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PersonalDocumentsSection>;

export default meta;
type Story = StoryObj<typeof PersonalDocumentsSection>;

export const Default: Story = {};

export const Empty: Story = {
  args: { documents: [] },
};
