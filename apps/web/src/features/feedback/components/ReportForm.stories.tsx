import type { Meta, StoryObj } from "@storybook/react";

import { ReportForm } from "./report-form";

const meta = {
  title: "Web/Feedback/ReportForm",
  component: ReportForm,
  tags: ["autodocs"],
  args: {
    context: {
      route: "/invoicing/invoices/12",
      browser:
        "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0",
      locale: "fr-FR",
    },
    onSubmit: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReportForm>;

export default meta;
type Story = StoryObj<typeof ReportForm>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

/** The relay answered 429: the instance spent its hourly allowance. */
export const Failed: Story = {
  args: {
    error:
      "Too many reports were sent from this instance recently. Try again in an hour.",
  },
};

export const Sent: Story = {
  args: {
    filedIssue: {
      number: 640,
      url: "https://github.com/opusline/opusline/issues/640",
    },
  },
};
