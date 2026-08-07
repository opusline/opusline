import type { Meta, StoryObj } from "@storybook/react";

import { SAMPLE_LOGO_SRC } from "@/lib/logo-fixture";
import { ClientLogo } from "./client-logo";

const meta = {
  title: "Web/ClientLogo",
  component: ClientLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "Nordlys", size: "lg", src: SAMPLE_LOGO_SRC },
};

export const Small: Story = {
  args: { name: "Nordlys", size: "sm", src: SAMPLE_LOGO_SRC },
};

export const WithoutLogo: Story = {
  args: { name: "Nordlys Conseil", size: "lg" },
};

export const WithoutLogoSmall: Story = {
  args: { name: "Nordlys Conseil", size: "sm" },
};

export const MissingLogoFallsBackToInitials: Story = {
  args: { name: "Callisto", size: "lg", src: "/does-not-exist.png" },
};
