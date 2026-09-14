import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { DeclarationDeadlineLine } from "./declaration-deadline-line";

const meta = {
  title: "Web/Declarations/DeclarationDeadlineLine",
  component: DeclarationDeadlineLine,
  tags: ["autodocs"],
  args: {
    deadline: { dueOn: "2026-08-31", daysLeft: 18 },
    completion: null,
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DeclarationDeadlineLine>;

export default meta;
type Story = StoryObj<typeof DeclarationDeadlineLine>;

export const Default: Story = {};

export const DueSoon: Story = {
  args: { deadline: { dueOn: "2026-08-31", daysLeft: 3 } },
};

export const Today: Story = {
  args: { deadline: { dueOn: "2026-08-31", daysLeft: 0 } },
};

export const Overdue: Story = {
  args: { deadline: { dueOn: "2026-08-31", daysLeft: -4 } },
};

export const Filed: Story = {
  args: { completion: { declaredOn: "2026-08-09", paidOn: null } },
};
