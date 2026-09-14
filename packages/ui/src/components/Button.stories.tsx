import type { Meta, StoryObj } from "@storybook/react";
import { FileTextIcon } from "lucide-react";
import { Button, ButtonLink } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">Très petit</Button>
      <Button size="sm">Petit</Button>
      <Button size="default">Normal</Button>
      <Button size="lg">Grand</Button>
      <Button size="xl">Nouveau client</Button>
      <Button size="2xl">Créer un client</Button>
    </div>
  ),
};

export const BrandOutline: Story = {
  args: {
    children: "Marquer comme lu",
    size: "xl",
    variant: "brand-outline",
  },
};

/** A file the user can open — the receipt on a journal row, a document in a list. */
export const File: Story = {
  render: () => (
    <ButtonLink
      render={<a download href="#lunaprint-facture-9921.pdf" />}
      size="lg"
      variant="file"
    >
      <FileTextIcon aria-hidden />
      lunaprint-facture-9921.pdf
    </ButtonLink>
  ),
};

/**
 * Anything that navigates. `ButtonLink` is the only sanctioned way to give a
 * `<Button>` an anchor to render: it opts out of Base UI's native-button
 * assumption, which otherwise drops `type="button"` onto the anchor.
 */
export const AsALink: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ButtonLink render={<a href="#clients-new" />} size="2xl">
        Créer un client
      </ButtonLink>
      <ButtonLink render={<a href="#clients" />} size="2xl" variant="outline">
        Voir les clients
      </ButtonLink>
    </div>
  ),
};

export const RaisedSurface: Story = {
  render: () => (
    <div className="flex items-center gap-2 bg-background p-4">
      <Button size="2xl" variant="outline">
        Sur la page
      </Button>
      <Button size="2xl" surface="raised" variant="outline">
        Surélevé
      </Button>
    </div>
  ),
};
