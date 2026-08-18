import type { Meta, StoryObj } from "@storybook/react";

import { invoiceSummary, stepTodoRow, unbilledTodoRow } from "../lib/fixtures";
import { InvoiceTodoPanel } from "./invoice-todo-panel";

const summary = invoiceSummary();

const meta = {
  title: "Web/Invoices/InvoiceTodoPanel",
  component: InvoiceTodoPanel,
  tags: ["autodocs"],
  args: {
    todo: summary.todo,
    todoTotal: summary.todoTotal,
    onRemind: () => {},
    onInvoice: () => {},
  },
} satisfies Meta<typeof InvoiceTodoPanel>;

export default meta;
type Story = StoryObj<typeof InvoiceTodoPanel>;

export const Default: Story = {};

export const HourlyMission: Story = {
  args: {
    todo: [
      unbilledTodoRow({
        missionName: "Vesterhus maintenance",
        valuedDays: null,
        valuedMinutes: 210,
        firstEntryOn: "2026-07-14",
        lastEntryOn: "2026-07-14",
        entryCount: 1,
      }),
    ],
    todoTotal: 1,
  },
};

export const Capped: Story = {
  args: { todoTotal: 24 },
};

export const Empty: Story = {
  args: { todo: [], todoTotal: 0 },
};

/**
 * All three kinds together. They are never summed: an overdue invoice is money
 * owed, unbilled work is value already earned, and an instalment is a term of a
 * contract coming round.
 */
export const EveryKind: Story = {
  args: {
    todo: [...summary.todo, stepTodoRow()],
    todoTotal: summary.todoTotal + 1,
  },
};

/** An instalment whose date has passed. */
export const OverdueStep: Story = {
  args: { todo: [stepTodoRow()], todoTotal: 1 },
};

/** An instalment with no date, surfaced because the work behind it was marked done. */
export const StepMarkedReady: Story = {
  args: {
    todo: [stepTodoRow({ dueOn: null, isReady: true, daysLate: 0 })],
    todoTotal: 1,
  },
};
