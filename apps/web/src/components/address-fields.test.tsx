import { useForm } from "@tanstack/react-form";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { AddressAutocompleteProvider } from "./address-autocomplete-provider";
import { AddressFields } from "./address-fields";

const NAMES = {
  line1: "companyAddressLine1",
  line2: "companyAddressLine2",
  postalCode: "companyPostalCode",
  city: "companyCity",
} as const;

function Harness() {
  const form = useForm({
    defaultValues: {
      companyAddressLine1: "",
      companyAddressLine2: "",
      companyPostalCode: "",
      companyCity: "",
    },
  });

  return (
    <AddressFields
      complementLabel="Complément d'adresse"
      gapClassName="gap-4"
      names={NAMES}
      renderField={(name, render) => (
        <form.Field name={name}>{(field) => render(field)}</form.Field>
      )}
      setFieldValue={(name, value) => form.setFieldValue(name, value)}
      streetLabel="Adresse"
    />
  );
}

it("suggests addresses for a business established in France", () => {
  render(
    <AddressAutocompleteProvider businessCountry="FR">
      <Harness />
    </AddressAutocompleteProvider>,
  );

  expect(screen.getByRole("combobox", { name: "Adresse" })).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Ville" })).toBeInTheDocument();
});

it("degrades to plain inputs for a country without an address lookup", () => {
  render(
    <AddressAutocompleteProvider businessCountry="CA">
      <Harness />
    </AddressAutocompleteProvider>,
  );

  expect(screen.getByRole("textbox", { name: "Adresse" })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: "Ville" })).toBeInTheDocument();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
});
