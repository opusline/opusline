import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "@tanstack/react-form";

import { clientVatRateValidator } from "../lib/client-form";
import {
  ClientVatRateExempt,
  ClientVatRateField,
} from "./client-vat-rate-field";

const meta = {
  title: "Web/ClientVatRateField",
  component: ClientVatRateField,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientVatRateField>;

export default meta;
type Story = StoryObj<typeof ClientVatRateField>;

function Harness({ defaultVatRate }: { defaultVatRate: string }) {
  const form = useForm({ defaultValues: { defaultVatRate } });

  return (
    <div className="max-w-sm">
      <form.Field
        name="defaultVatRate"
        validators={{ onChange: clientVatRateValidator("fr-FR") }}
      >
        {(field) => (
          <ClientVatRateField
            accountVatRateBp={2000}
            field={field}
            locale="fr-FR"
          />
        )}
      </form.Field>
    </div>
  );
}

/** The usual case: the client follows whatever the account charges. */
export const FollowsTheAccount: Story = {
  render: () => <Harness defaultVatRate="" />,
};

/** A client outside the scope of French TVA — billed at zero, and it stays zero. */
export const NeverCharged: Story = {
  render: () => <Harness defaultVatRate="0" />,
};

export const ReducedRate: Story = {
  render: () => <Harness defaultVatRate="5,5" />,
};

export const Invalid: Story = {
  render: () => <Harness defaultVatRate="cent-vingt" />,
};

/** What the field becomes when the account charges no TVA to anyone. */
export const Franchise: Story = {
  render: () => (
    <div className="max-w-sm">
      <ClientVatRateExempt />
    </div>
  ),
};
