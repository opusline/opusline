import type { Meta, StoryObj } from "@storybook/react";
import { linkVariants, TextLink } from "./text-link";

const meta = {
  title: "UI/TextLink",
  component: TextLink,
  tags: ["autodocs"],
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof TextLink>;

export const Default: Story = {
  args: {
    children: "Voir la mission",
    href: "#mission",
  },
};

/** `inherit` takes the size of whatever line it sits on; the other two set it. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <TextLink href="#invoice">Ouvrir le document</TextLink>
      <TextLink href="#mission" size="sm">
        Voir la mission
      </TextLink>
      <TextLink href="#deadline" size="xs">
        Voir l'échéance
      </TextLink>
    </div>
  ),
};

/**
 * Inside a sentence the colour alone is not enough to tell the link from the
 * words around it, so the underline is permanent rather than on hover.
 */
export const InRunningText: Story = {
  render: () => (
    <p className="max-w-sm text-sm">
      Les seuils sont ceux de la{" "}
      <TextLink href="#franchise" size="sm" underline="always">
        franchise en base de TVA
      </TextLink>
      , révisés chaque année.
    </p>
  ),
};

/** A router `<Link>` needs the role's classes without another element around it. */
export const AsClasses: Story = {
  render: () => (
    <a className={linkVariants({ size: "sm" })} href="#clients">
      Tous les clients
    </a>
  ),
};
