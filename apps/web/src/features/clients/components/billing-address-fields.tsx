import type { ReactNode } from "react";

import {
  FormTextField,
  type StringFieldApi,
} from "@/components/form-text-field";
import { SuggestField } from "@/components/suggest-field";
import { searchAddresses, searchCities } from "@/lib/addresses";
import { searchCountries } from "@/lib/countries";

export type BillingAddressFieldName =
  | "billingAddressLine1"
  | "billingAddressLine2"
  | "billingPostalCode"
  | "billingCity"
  | "billingCountry";

type BillingAddressFieldsProps = {
  renderField: (
    name: BillingAddressFieldName,
    render: (field: StringFieldApi) => ReactNode,
  ) => ReactNode;
  setFieldValue: (name: BillingAddressFieldName, value: string) => void;
  labelClassName?: string;
  streetLabel: string;
  complementLabel: string;
  withPlaceholders?: boolean;
  gapClassName: string;
};

export function BillingAddressFields({
  renderField,
  setFieldValue,
  labelClassName,
  streetLabel,
  complementLabel,
  withPlaceholders = false,
  gapClassName,
}: BillingAddressFieldsProps) {
  const placeholder = (value: string) => (withPlaceholders ? value : undefined);

  return (
    <div className={`flex flex-col ${gapClassName}`}>
      {renderField("billingAddressLine1", (field) => (
        <SuggestField
          field={field}
          label={streetLabel}
          labelClassName={labelClassName}
          onSearch={searchAddresses}
          onSelect={(suggestion) => {
            field.handleChange(suggestion.line1);
            setFieldValue("billingPostalCode", suggestion.postalCode);
            setFieldValue("billingCity", suggestion.city);
            setFieldValue("billingCountry", "France");
          }}
          placeholder={placeholder("12 rue de la Paix")}
        />
      ))}

      {renderField("billingAddressLine2", (field) => (
        <FormTextField
          field={field}
          label={complementLabel}
          labelClassName={labelClassName}
          placeholder={placeholder("Bâtiment C, 3e étage")}
        />
      ))}

      <div
        className={`grid ${gapClassName} sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]`}
      >
        {renderField("billingPostalCode", (field) => (
          <FormTextField
            field={field}
            label="Code postal"
            labelClassName={labelClassName}
            placeholder={placeholder("44000")}
          />
        ))}

        {renderField("billingCity", (field) => (
          <SuggestField
            field={field}
            label="Ville"
            labelClassName={labelClassName}
            onSearch={searchCities}
            onSelect={(suggestion) => {
              field.handleChange(suggestion.city);
              setFieldValue("billingPostalCode", suggestion.postalCode);
              setFieldValue("billingCountry", "France");
            }}
            placeholder={placeholder("Nantes")}
          />
        ))}
      </div>

      {renderField("billingCountry", (field) => (
        <SuggestField
          field={field}
          label="Pays"
          labelClassName={labelClassName}
          onSearch={async (query) => searchCountries(query)}
          onSelect={(suggestion) => field.handleChange(suggestion.label)}
          placeholder={placeholder("France")}
        />
      ))}
    </div>
  );
}
