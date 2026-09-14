import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Panel, PanelDescription, PanelHeader, PanelTitle } from "./panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "UI/Panel",
  component: Panel,
  tags: ["autodocs"],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof Panel>;

/** A padded block of content — the shape most of the settings screens draw. */
export const Default: Story = {
  render: () => (
    <Panel className="max-w-xl" padding="loose">
      <PanelTitle>Identité</PanelTitle>
      <PanelDescription>
        Les informations qui apparaissent en en-tête de vos factures et de votre
        CRA.
      </PanelDescription>
    </Panel>
  ),
};

/**
 * A header rule over children that run edge to edge. `clip` is what rounds the
 * last row's corners off against the border.
 */
export const Headed: Story = {
  render: () => (
    <Panel className="max-w-xl" clip>
      <PanelHeader layout="split">
        <PanelTitle size="lg">Historique</PanelTitle>
        <span className="text-muted-foreground-3 text-xs">6 mois</span>
      </PanelHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="first:pl-5"
              density="compact"
              tone="eyebrow-quiet"
            >
              Mois
            </TableHead>
            <TableHead
              className="w-28 text-right last:pr-5"
              density="compact"
              tone="eyebrow-quiet"
            >
              URSSAF
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="first:pl-5" density="compact" tone="strong">
              Août 2026
            </TableCell>
            <TableCell
              className="text-right font-mono tabular-nums last:pr-5"
              density="compact"
            >
              1 812,00 €
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="first:pl-5" density="compact" tone="strong">
              Juillet 2026
            </TableCell>
            <TableCell
              className="text-right font-mono tabular-nums last:pr-5"
              density="compact"
            >
              2 044,00 €
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Panel>
  ),
};

/** The sunken header, for a panel that lists work still to do. */
export const SunkenHeader: Story = {
  render: () => (
    <Panel className="max-w-xl" clip>
      <PanelHeader layout="split" surface="sunken">
        <PanelTitle size="sm">À facturer</PanelTitle>
        <span className="text-muted-foreground-3 text-xs">2 missions</span>
      </PanelHeader>
      <div className="flex items-center justify-between gap-4 px-5 py-3.5">
        <span className="text-foreground-hi text-sm">Nordlys — Refonte</span>
        <Button size="sm" variant="outline">
          Facturer
        </Button>
      </div>
    </Panel>
  ),
};

/**
 * A panel nested in another panel's body titles itself an `h3`, so a reader
 * listing the page by its headings never meets a skipped level.
 */
export const NestedHeadingLevel: Story = {
  render: () => (
    <Panel className="max-w-xl" padding="default">
      <PanelTitle>Compte pro</PanelTitle>
      <Panel className="mt-4" padding="compact">
        <PanelTitle level={3} size="eyebrow">
          Provisions
        </PanelTitle>
      </Panel>
    </Panel>
  ),
};
