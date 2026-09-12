import { Button } from "@opusline/ui/components/button";
import { PeriodNavigator } from "@opusline/ui/components/period-navigator";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import type { Meta, StoryObj } from "@storybook/react";
import { PlusIcon } from "lucide-react";

import { StoryRouter } from "@/test/story-router";

import { expensesMonth } from "../lib/fixtures";
import { ExpensesPage } from "./expenses-page";
import { JournalTab } from "./journal-tab";

const meta = {
  title: "Web/Expenses/ExpensesPage",
  component: ExpensesPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    action: (
      <Button size="xl">
        <PlusIcon aria-hidden />
        Ajouter une dépense
      </Button>
    ),
    controls: (
      <>
        <PeriodNavigator
          isNextDisabled
          label="août 2026"
          nextLabel="Mois suivant"
          onNext={() => {}}
          onPrevious={() => {}}
          previousLabel="Mois précédent"
          size="sm"
        />
        <SegmentedControl
          aria-label="Montants affichés"
          defaultValue={["ht"]}
          size="sm"
          variant="raised"
        >
          <SegmentedControlItem value="ht">HT</SegmentedControlItem>
          <SegmentedControlItem value="ttc">TTC</SegmentedControlItem>
        </SegmentedControl>
      </>
    ),
    children: (
      <JournalTab
        isRefreshing={false}
        month={expensesMonth()}
        onAttachReceipt={() => {}}
        onDelete={() => {}}
        onDetachReceipt={() => {}}
        onDuplicate={() => {}}
        onEdit={() => {}}
        unit="ht"
        uploadingExpenseId={null}
      />
    ),
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ExpensesPage>;

export default meta;
type Story = StoryObj<typeof ExpensesPage>;

export const Default: Story = {};
