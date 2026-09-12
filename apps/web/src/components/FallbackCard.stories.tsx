import { Button } from "@opusline/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react";

import { FallbackCard } from "./fallback-card";

const meta = {
  title: "Web/FallbackCard",
  component: FallbackCard,
  tags: ["autodocs"],
  args: {
    title: "Something went wrong",
    hint: "Trying again usually helps; if not, head back to the dashboard.",
    children: (
      <>
        <Button>Try again</Button>
        <Button variant="outline">Back to the dashboard</Button>
      </>
    ),
  },
} satisfies Meta<typeof FallbackCard>;

export default meta;
type Story = StoryObj<typeof FallbackCard>;

export const Default: Story = {};

export const SingleAction: Story = {
  args: {
    title: "Page not found",
    hint: "Nothing lives at this address.",
    children: <Button>Back to the dashboard</Button>,
  },
};
