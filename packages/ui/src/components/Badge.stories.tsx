import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon } from "lucide-react";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Direct",
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="neutral">Direct</Badge>
      <Badge variant="quiet">Archivé</Badge>
      <Badge variant="brand">Active</Badge>
      <Badge variant="brand-solid">Non lu</Badge>
      <Badge variant="success">Payée</Badge>
      <Badge variant="warn">En retard</Badge>
      <Badge variant="attention">Bloquée</Badge>
      <Badge variant="info">Autoliquidée</Badge>
      <Badge variant="brand-outline">À déduire</Badge>
    </div>
  ),
};

/**
 * `attention` is the amber "needs a look" tone — a missing receipt, a deadline
 * in five days — distinct from `warn`, which is the warm destructive wash.
 * `info` is the cool blue of a state that is fine but worth knowing.
 */
export const StatusPills: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge shape="pill" variant="success">
        <CheckIcon aria-hidden />
        Déduite
      </Badge>
      <Badge shape="pill" variant="attention">
        Bloquée
      </Badge>
      <Badge shape="pill" variant="quiet">
        Reportée
      </Badge>
      <Badge shape="pill" variant="info">
        Autoliquidée
      </Badge>
      <Badge shape="pill" variant="brand-outline">
        À déduire
      </Badge>
    </div>
  ),
};

export const ClientRow: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="neutral">Intermédiaire</Badge>
      <Badge variant="brand">Nouveau</Badge>
      <Badge variant="quiet">Perso</Badge>
    </div>
  ),
};
