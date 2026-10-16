import type { Meta, StoryObj } from "@storybook/react";

import { SAMPLE_LOGO_SRC } from "@/lib/logo-fixture";
import { CompanyLogoField } from "./company-logo-field";

const meta = {
  title: "Web/CompanyLogoField",
  component: CompanyLogoField,
  tags: ["autodocs"],
  args: {
    testId: "story-logo",
    logo: {
      isPending: false,
      error: null,
      onPick: () => {},
      onRemove: () => {},
    },
  },
} satisfies Meta<typeof CompanyLogoField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Stored: Story = {
  args: {
    logo: {
      src: SAMPLE_LOGO_SRC,
      isPending: false,
      error: null,
      onPick: () => {},
      onRemove: () => {},
    },
  },
};

export const Uploading: Story = {
  args: {
    logo: {
      isPending: true,
      error: null,
      onPick: () => {},
      onRemove: () => {},
    },
  },
};

export const Refused: Story = {
  args: {
    logo: {
      isPending: false,
      error: "PNG, JPG or SVG up to 1.5 MB.",
      onPick: () => {},
      onRemove: () => {},
    },
  },
};
