import type { MissionBillingStepData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";
import { MissionBillingSchedule } from "./mission-billing-schedule";

const fixedPrice = eur(800_000);

const steps: MissionBillingStepData[] = [
  {
    id: 1,
    label: "Lancement",
    amount: eur(240_000),
    position: 0,
    dueOn: null,
    isReady: false,
    invoiceId: 41,
    invoiceStatus: 1,
  },
  {
    id: 2,
    label: "Mise en recette",
    amount: eur(320_000),
    position: 1,
    dueOn: null,
    isReady: false,
    invoiceId: 42,
    invoiceStatus: 1,
  },
  {
    id: 3,
    label: "Mise en production",
    amount: eur(240_000),
    position: 2,
    dueOn: "2026-09-30",
    isReady: false,
    invoiceId: null,
    invoiceStatus: null,
  },
];

const meta = {
  title: "Web/MissionBillingSchedule",
  component: MissionBillingSchedule,
  tags: ["autodocs"],
  args: {
    steps,
    scheduledCents: 800_000,
    fixedPrice,
    onAdd: () => {},
    onDelete: () => {},
    onSetReady: () => {},
    onBill: () => {},
  },
} satisfies Meta<typeof MissionBillingSchedule>;

export default meta;
type Story = StoryObj<typeof MissionBillingSchedule>;

/** Two instalments billed, the last one still waiting for its date. */
export const Default: Story = {};

/** The schedule is optional: without one, the forfait is billed whenever you decide. */
export const NoSchedule: Story = {
  args: { steps: [], scheduledCents: 0 },
};

/** The project event happened, so the step is billable ahead of any date. */
export const StepMarkedReady: Story = {
  args: {
    steps: steps.map((step) =>
      step.id === 3 ? { ...step, isReady: true, dueOn: null } : step,
    ),
  },
};

/**
 * An avenant raised the price and the schedule has not caught up. Reported, never
 * refused — the contract is what it is.
 */
export const DoesNotAddUp: Story = {
  args: {
    fixedPrice: eur(900_000),
    scheduledCents: 800_000,
  },
};

export const Loading: Story = {
  args: { isPending: true },
};

export const Failed: Story = {
  args: { isError: true },
};

export const SaveFailed: Story = {
  args: {
    error: "L'échéance n'a pas pu être enregistrée. Réessayez dans un instant.",
  },
};
