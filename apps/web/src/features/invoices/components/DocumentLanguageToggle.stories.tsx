import type { Meta, StoryObj } from "@storybook/react";

import { DocumentLanguageToggle } from "./document-language-toggle";

const meta = {
  title: "Web/DocumentLanguageToggle",
  component: DocumentLanguageToggle,
  tags: ["autodocs"],
  args: { value: 0, onChange: () => {} },
} satisfies Meta<typeof DocumentLanguageToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const French: Story = {};

export const English: Story = { args: { value: 1 } };
