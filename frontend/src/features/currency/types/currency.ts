export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export type CurrencyConversionPayload = {
  amount: number;
  from_currency: SupportedCurrency;
  to_currency: SupportedCurrency;
};

export type CurrencyConversionApiResponse = {
  original_amount: number | string;
  converted_amount: number | string;
  from_currency: SupportedCurrency;
  to_currency: SupportedCurrency;
  exchange_rate: number | string;
};

export type CurrencyConversion = {
  originalAmount: number;
  convertedAmount: number;
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  exchangeRate: number;
};

export type CurrencyTotals = {
  currency: SupportedCurrency;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  holdingsCount: number;
};

export type ConvertibleCurrencyTotal = {
  currency: SupportedCurrency;
  amount: number;
};

export type ConvertedCurrencyTotal = {
  sourceCurrency: SupportedCurrency;
  targetCurrency: SupportedCurrency;
  originalAmount: number;
  convertedAmount: number;
  exchangeRate: number;
};

export type CurrencyContextValue = {
  preferredCurrency: SupportedCurrency;
  setPreferredCurrency: (currency: SupportedCurrency) => void;
  supportedCurrencies: readonly SupportedCurrency[];
};
