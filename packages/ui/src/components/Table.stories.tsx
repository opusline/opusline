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
          <TableCell>Catamania</TableCell>
          <TableCell>
            <Badge variant="brand">Intermédiaire</Badge>
          </TableCell>
          <TableCell className="text-right">1</TableCell>
          <TableCell className="text-right">63 800 €</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>HartPrint</TableCell>
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
