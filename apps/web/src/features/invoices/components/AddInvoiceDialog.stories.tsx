import type { Meta, StoryObj } from "@storybook/react";

import {
  CLIENT_FIXTURE,
  fixedPriceBudget,
  MISSION_FIXTURE,
  overrunFixedPriceBudget,
} from "../lib/fixtures";
import { AddInvoiceDialog, type AddInvoiceMission } from "./add-invoice-dialog";

const client = { ...CLIENT_FIXTURE, missions: [] };

const daily: AddInvoiceMission = {
  budget: null,
  client,
  mission: MISSION_FIXTURE,
};

const forfait: AddInvoiceMission = {
  budget: fixedPriceBudget(),
  client,
  mission: {
    ...MISSION_FIXTURE,
    billingMode: 2,
    id: 11,
    name: "Lunaprint refonte boutique",
    rate: { amount: 1_000_000, currency: "EUR" },
    referenceDailyRate: { amount: 48_000, currency: "EUR" },
    slug: "lunaprint-refonte-boutique",
  },
};

const meta = {
  title: "Web/Invoices/AddInvoiceDialog",
  component: AddInvoiceDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    accountToday: "2026-08-19",
    defaultVatRateBp: 2000,
    error: null,
    isSaving: false,
    missions: [daily, forfait],
    onOpenChange: () => {},
    onSubmit: () => {},
    open: true,
    suggestedNumber: "F-2026-044",
    vatLiable: true,
  },
} satisfies Meta<typeof AddInvoiceDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A mission billed by the day: nothing but the invoice's own fields. */
export const Default: Story = {};

/** A forfait: the price, what it has already billed, and what is left of it. */
export const OnAForfaitMission: Story = {
  args: { initialMissionId: forfait.mission.id },
};

/** Already over the price — the panel says so before the amount is even typed. */
export const OnAnOverrunForfait: Story = {
  args: {
    initialMissionId: forfait.mission.id,
    missions: [daily, { ...forfait, budget: overrunFixedPriceBudget() }],
  },
};

/** Under the franchise en base there is no rate that could lawfully be charged. */
export const WithoutVat: Story = { args: { vatLiable: false } };

export const WithoutAnyMission: Story = { args: { missions: [] } };

/** The mission list is fetched when the dialog opens; until it lands, say so. */
export const LoadingMissions: Story = {
  args: { isLoading: true, missions: [] },
};
