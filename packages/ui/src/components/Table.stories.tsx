import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Missions</TableHead>
          <TableHead className="text-right">CA 2026</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Nordlys</TableCell>
          <TableCell>
            <Badge variant="brand">Intermédiaire</Badge>
          </TableCell>
          <TableCell className="text-right">1</TableCell>
          <TableCell className="text-right">63 800 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Lunaprint</TableCell>
          <TableCell>
            <Badge>Direct</Badge>
          </TableCell>
          <TableCell className="text-right">1</TableCell>
          <TableCell className="text-right">4 930 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Perso</TableCell>
          <TableCell>
            <Badge>Interne</Badge>
          </TableCell>
          <TableCell className="text-right">1</TableCell>
          <TableCell className="text-right">—</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

/** The ledger rhythm: an eyebrow head over rows of figures. */
export const Compact: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead density="compact" tone="eyebrow-quiet">
            Fournisseur
          </TableHead>
          <TableHead className="w-24" density="compact" tone="eyebrow-quiet">
            Date
          </TableHead>
          <TableHead
            className="w-28 text-right"
            density="compact"
            tone="eyebrow-quiet"
          >
            HT
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell density="compact" tone="strong">
            Ateliers Ruche
          </TableCell>
          <TableCell density="compact" tone="quiet">
            04/09/2026
          </TableCell>
          <TableCell
            className="text-right font-mono tabular-nums"
            density="compact"
          >
            1 240,00 €
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell density="compact" tone="strong">
            Studio Lorem
          </TableCell>
          <TableCell density="compact" tone="quiet">
            28/08/2026
          </TableCell>
          <TableCell
            className="text-right font-mono tabular-nums"
            density="compact"
          >
            310,50 €
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
