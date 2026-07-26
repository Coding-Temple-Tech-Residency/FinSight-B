import { useCallback, useMemo, useState, type ReactNode } from "react";

import { CurrencyContext } from "../context/CurrencyContext";

import {
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "../types/currency";

const PREFERRED_CURRENCY_KEY = "preferredCurrency";
const DEFAULT_CURRENCY: SupportedCurrency = "USD";

type CurrencyProviderProps = {
  children: ReactNode;
};

const isSupportedCurrency = (
  value: string | null,
): value is SupportedCurrency => {
  return SUPPORTED_CURRENCIES.some((currency) => currency === value);
};

const getInitialPreferredCurrency = (): SupportedCurrency => {
  if (typeof window === "undefined") {
    return DEFAULT_CURRENCY;
  }

  const savedCurrency = window.localStorage.getItem(PREFERRED_CURRENCY_KEY);

  return isSupportedCurrency(savedCurrency) ? savedCurrency : DEFAULT_CURRENCY;
};

const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [preferredCurrency, setPreferredCurrencyState] =
    useState<SupportedCurrency>(getInitialPreferredCurrency);

  const setPreferredCurrency = useCallback((currency: SupportedCurrency) => {
    setPreferredCurrencyState(currency);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PREFERRED_CURRENCY_KEY, currency);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      preferredCurrency,
      setPreferredCurrency,
      supportedCurrencies: SUPPORTED_CURRENCIES,
    }),
    [preferredCurrency, setPreferredCurrency],
  );

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;
