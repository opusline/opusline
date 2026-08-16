import type { Meta, StoryObj } from "@storybook/react";

import { invoiceSummary, unbilledTodoRow } from "../lib/fixtures";
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
    onCreateInvoice: () => {},
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
