import type { Currency, DateFormat, Locale } from "@opusline/api-client";
import { createContext, type ReactNode, useContext, useMemo } from "react";

import { DEFAULT_MONEY_FORMAT, type MoneyFormat } from "@/lib/billing";

/**
 * Defaults to the fresh-account format (fr-FR / EUR) rather than throwing so
 * stories and tests render without wiring; the authed layout always mounts the
 * provider with the real account values.
 */
const MoneyFormatContext = createContext<MoneyFormat>(DEFAULT_MONEY_FORMAT);

/** 0 = 31/08/2026, the fresh-account default; the authed layout overrides it. */
const DateFormatContext = createContext<DateFormat>(0);

export function MoneyFormatProvider({
  locale,
  currency,
  dateFormat = 0,
  children,
}: {
  locale: Locale;
  currency: Currency;
  dateFormat?: DateFormat;
  children: ReactNode;
}) {
  const format = useMemo(() => ({ locale, currency }), [locale, currency]);

  return (
    <MoneyFormatContext.Provider value={format}>
      <DateFormatContext.Provider value={dateFormat}>
        {children}
      </DateFormatContext.Provider>
    </MoneyFormatContext.Provider>
  );
}

export function useMoneyFormat(): MoneyFormat {
  return useContext(MoneyFormatContext);
}

/** The account locale alone, for formatting that has nothing to do with money. */
export function useLocale(): Locale {
  return useContext(MoneyFormatContext).locale;
}

export function useDateFormat(): DateFormat {
  return useContext(DateFormatContext);
}
