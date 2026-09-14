import type { Meta, StoryObj } from "@storybook/react";

import {
  blockedExpense,
  declaredExpensesMonth,
  deferredExpense,
  exemptExpense,
  expense,
  expensesMonth,
  franchiseExpensesMonth,
  reverseChargedExpense,
} from "../lib/fixtures";
import { ExpenseStatusBadge } from "./expense-status-badge";

const meta = {
  title: "Web/Expenses/ExpenseStatusBadge",
  component: ExpenseStatusBadge,
  tags: ["autodocs"],
  args: { expense: expense(), month: expensesMonth() },
} satisfies Meta<typeof ExpenseStatusBadge>;

export default meta;
type Story = StoryObj<typeof ExpenseStatusBadge>;

/** One pill per status, the line under it saying which CA3 or what is missing. */
export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <ExpenseStatusBadge {...args} expense={expense()} />
      <ExpenseStatusBadge
        {...args}
        expense={{ ...expense(), vatStatus: 1 }}
        month={declaredExpensesMonth()}
      />
      <ExpenseStatusBadge {...args} expense={deferredExpense()} />
      <ExpenseStatusBadge
        {...args}
        expense={{ ...deferredExpense(), isRegularisation: true }}
      />
      <ExpenseStatusBadge {...args} expense={blockedExpense()} />
      <ExpenseStatusBadge {...args} expense={reverseChargedExpense()} />
      <ExpenseStatusBadge
        {...args}
        expense={{ ...reverseChargedExpense(), vatTreatment: 1 }}
      />
      <ExpenseStatusBadge {...args} expense={exemptExpense()} />
    </div>
  ),
};

/** Under the franchise the pill only says whether the receipt is there. */
export const Franchise: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <ExpenseStatusBadge
        {...args}
        expense={expense()}
        month={franchiseExpensesMonth()}
      />
      <ExpenseStatusBadge
        {...args}
        expense={blockedExpense()}
        month={franchiseExpensesMonth()}
      />
    </div>
  ),
};

export const WithoutSub: Story = {
  args: { expense: blockedExpense(), withSub: false },
};
