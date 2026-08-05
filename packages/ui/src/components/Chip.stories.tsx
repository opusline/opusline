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
    <ChipGroup
      className="items-stretch"
      defaultValue={["1"]}
      aria-label="Type de relation"
    >
      <ChipOption
        value="0"
        label="Client direct"
        hint="Vous facturez et livrez directement."
      />
      <ChipOption
        value="1"
        label="ESN / intermédiaire"
        hint="Vous facturez l'ESN, qui facture son client final."
      />
      <ChipOption
        value="2"
        label="Interne / perso"
        hint="Projets non facturables, suivis pour mémoire."
      />
    </ChipGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation (XL)">
        <Chip value="jour" size="xl">
          Au jour
        </Chip>
        <Chip value="heure" size="xl">
          À l'heure
        </Chip>
        <Chip value="forfait" size="xl">
          Forfait
        </Chip>
      </ChipGroup>
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation (LG)">
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
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation (MD)">
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
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation (SM)">
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
