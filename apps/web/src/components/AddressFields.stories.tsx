import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "@tanstack/react-form";

import { AddressAutocompleteProvider } from "./address-autocomplete-provider";
import { AddressFields } from "./address-fields";

const meta = {
  title: "Web/AddressFields",
  component: AddressFields,
  tags: ["autodocs"],
} satisfies Meta<typeof AddressFields>;

export default meta;
type Story = StoryObj<typeof AddressFields>;

const BILLING_NAMES = {
  line1: "billingAddressLine1",
  line2: "billingAddressLine2",
  postalCode: "billingPostalCode",
  city: "billingCity",
  country: "billingCountry",
} as const;

const COMPANY_NAMES = {
  line1: "companyAddressLine1",
  line2: "companyAddressLine2",
  postalCode: "companyPostalCode",
  city: "companyCity",
} as const;

export const WithCountry: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        billingAddressLine1: "",
        billingAddressLine2: "",
        billingPostalCode: "",
        billingCity: "",
        billingCountry: "",
      },
    });

    return (
      <div className="max-w-lg">
        <AddressFields
          complementLabel="Complément d'adresse"
          gapClassName="gap-4"
          names={BILLING_NAMES}
          renderField={(name, render) => (
            <form.Field name={name}>{(field) => render(field)}</form.Field>
          )}
          setFieldValue={(name, value) => form.setFieldValue(name, value)}
          streetLabel="Adresse de facturation"
          withPlaceholders
        />
      </div>
    );
  },
};

export const WithoutCountry: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        companyAddressLine1: "",
        companyAddressLine2: "",
        companyPostalCode: "",
        companyCity: "",
      },
    });

    return (
      <div className="max-w-lg">
        <AddressFields
          complementLabel="Complément d'adresse"
          gapClassName="gap-4"
          names={COMPANY_NAMES}
          renderField={(name, render) => (
            <form.Field name={name}>{(field) => render(field)}</form.Field>
          )}
          setFieldValue={(name, value) => form.setFieldValue(name, value)}
          streetLabel="Adresse"
          withPlaceholders
        />
      </div>
    );
  },
};

/** A business abroad has no address lookup: every field is a plain input. */
export const WithoutAutocomplete: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        companyAddressLine1: "",
        companyAddressLine2: "",
        companyPostalCode: "",
        companyCity: "",
      },
    });

    return (
      <AddressAutocompleteProvider businessCountry="CA">
        <div className="max-w-lg">
          <AddressFields
            complementLabel="Complément d'adresse"
            gapClassName="gap-4"
            names={COMPANY_NAMES}
            renderField={(name, render) => (
              <form.Field name={name}>{(field) => render(field)}</form.Field>
            )}
            setFieldValue={(name, value) => form.setFieldValue(name, value)}
            streetLabel="Adresse"
            withPlaceholders
          />
        </div>
      </AddressAutocompleteProvider>
    );
  },
};
