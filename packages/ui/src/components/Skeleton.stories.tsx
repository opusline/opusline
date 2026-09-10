import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => (
    <div className="flex max-w-sm items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
};

/**
 * The two grounds a loading block is laid on — the page and a card. Both are
 * shown here because the fill has to read against each of them, in both
 * palettes: switch the toolbar to dark and the blocks must still be blocks.
 */
export const OnSurfaces: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4 bg-background p-4">
      <Skeleton className="h-16 w-full" />
      <div className="rounded-lg border bg-card p-4">
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  ),
};
