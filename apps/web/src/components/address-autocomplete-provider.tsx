import { createContext, type ReactNode, useContext, useMemo } from "react";

import {
  type AddressAutocomplete,
  addressAutocompleteFor,
} from "@/lib/addresses";

/**
 * Defaults to the French lookup rather than throwing so stories and tests
 * render without wiring; the authed layout always mounts the provider with the
 * real business country.
 */
const AddressAutocompleteContext = createContext<AddressAutocomplete | null>(
  addressAutocompleteFor("FR"),
);

export function AddressAutocompleteProvider({
  businessCountry,
  children,
}: {
  businessCountry: string;
  children: ReactNode;
}) {
  const autocomplete = useMemo(
    () => addressAutocompleteFor(businessCountry),
    [businessCountry],
  );

  return (
    <AddressAutocompleteContext.Provider value={autocomplete}>
      {children}
    </AddressAutocompleteContext.Provider>
  );
}

export function useAddressAutocomplete(): AddressAutocomplete | null {
  return useContext(AddressAutocompleteContext);
}
