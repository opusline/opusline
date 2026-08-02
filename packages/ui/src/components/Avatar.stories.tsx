import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>TM</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="Théo Marchand" src="/logo.svg" />
      <AvatarFallback>TM</AvatarFallback>
    </Avatar>
  ),
};
