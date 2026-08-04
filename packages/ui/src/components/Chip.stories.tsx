import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip, ChipCount, ChipGroup, ChipOption } from "./chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => (
    <ChipGroup defaultValue={["direct"]} aria-label="Type de client">
      <Chip value="direct">Direct</Chip>
      <Chip value="intermediaire">Intermédiaire</Chip>
      <Chip value="interne">Interne</Chip>
    </ChipGroup>
  ),
};

function FilterExample() {
  const [scope, setScope] = useState("all");

  return (
    <ChipGroup
      value={[scope]}
      onValueChange={(value) => {
        const next = value[0];
        if (typeof next === "string") {
          setScope(next);
        }
      }}
      aria-label="Filtrer les clients"
    >
      <Chip value="all" shape="pill">
        Tous
        <ChipCount>6</ChipCount>
      </Chip>
      <Chip value="active" shape="pill">
        Actifs
        <ChipCount>4</ChipCount>
      </Chip>
      <Chip value="archived" shape="pill">
        Archivés
        <ChipCount>2</ChipCount>
      </Chip>
    </ChipGroup>
  );
}

export const FilterWithCounts: Story = {
  render: () => <FilterExample />,
};

export const Options: Story = {
  render: () => (
    <ChipGroup defaultValue={["1"]} aria-label="Type de relation">
      <ChipOption
        value="0"
        label="Direct"
        hint="Vous facturez le client directement"
      />
      <ChipOption
        value="1"
        label="Intermédiaire"
        hint="ESN ou portage entre vous et le client final"
      />
      <ChipOption value="2" label="Interne" hint="Vos projets, non facturés" />
    </ChipGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation">
        <Chip value="jour" size="lg">
          Au jour
        </Chip>
        <Chip value="heure" size="lg">
          À l'heure
        </Chip>
        <Chip value="forfait" size="lg">
          Forfait
        </Chip>
      </ChipGroup>
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation">
        <Chip value="jour" size="md">
          Au jour
        </Chip>
        <Chip value="heure" size="md">
          À l'heure
        </Chip>
        <Chip value="forfait" size="md">
          Forfait
        </Chip>
      </ChipGroup>
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation">
        <Chip value="jour" size="sm">
          Au jour
        </Chip>
        <Chip value="heure" size="sm">
          À l'heure
        </Chip>
        <Chip value="forfait" size="sm">
          Forfait
        </Chip>
      </ChipGroup>
    </div>
  ),
};
