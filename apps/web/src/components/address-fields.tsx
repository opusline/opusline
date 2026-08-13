import type { ReactNode } from "react";

import {
  FormTextField,
  type StringFieldApi,
} from "@/components/form-text-field";
import { SuggestField } from "@/components/suggest-field";
import { searchAddresses, searchCities } from "@/lib/addresses";
import { searchCountries } from "@/lib/countries";

export type AddressFieldNames<TName extends string> = {
  line1: TName;
  line2: TName;
  postalCode: TName;
  city: TName;
  country?: TName;
};

type AddressFieldsProps<TName extends string> = {
  names: AddressFieldNames<TName>;
  renderField: (
    name: TName,
    render: (field: StringFieldApi) => ReactNode,
  ) => ReactNode;
  setFieldValue: (name: TName, value: string) => void;
  labelClassName?: string;
  streetLabel: string;
  complementLabel: string;
  withPlaceholders?: boolean;
  gapClassName: string;
};

export function AddressFields<TName extends string>({
  names,
  renderField,
  setFieldValue,
  labelClassName,
  streetLabel,
  complementLabel,
  withPlaceholders = false,
  gapClassName,
}: AddressFieldsProps<TName>) {
  const placeholder = (value: string) => (withPlaceholders ? value : undefined);

  const setCountryToFrance = () => {
    if (names.country !== undefined) {
      setFieldValue(names.country, "France");
    }
  };

  const fillFromSuggestion = (postalCode: string, city: string) => {
    setFieldValue(names.postalCode, postalCode);
    setFieldValue(names.city, city);
    setCountryToFrance();
  };

  return (
    <div className={`flex flex-col ${gapClassName}`}>
      {renderField(names.line1, (field) => (
        <SuggestField
          field={field}
          label={streetLabel}
          labelClassName={labelClassName}
          onSearch={searchAddresses}
          onSelect={(suggestion) => {
            field.handleChange(suggestion.line1);
            fillFromSuggestion(suggestion.postalCode, suggestion.city);
          }}
          placeholder={placeholder("12 rue de l'Exemple")}
        />
      ))}

      {renderField(names.line2, (field) => (
        <FormTextField
          field={field}
          label={complementLabel}
          labelClassName={labelClassName}
          placeholder={placeholder("Bâtiment, étage, boîte…")}
        />
      ))}

      <div
        className={`grid ${gapClassName} sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]`}
      >
        {renderField(names.postalCode, (field) => (
          <FormTextField
            field={field}
            label="Code postal"
            labelClassName={labelClassName}
            placeholder={placeholder("00000")}
          />
        ))}

        {renderField(names.city, (field) => (
          <SuggestField
            field={field}
            label="Ville"
            labelClassName={labelClassName}
            onSearch={searchCities}
            onSelect={(suggestion) => {
              field.handleChange(suggestion.city);
              setFieldValue(names.postalCode, suggestion.postalCode);
              setCountryToFrance();
            }}
            placeholder={placeholder("Ville")}
          />
        ))}
      </div>

      {names.country === undefined
        ? null
        : renderField(names.country, (field) => (
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
