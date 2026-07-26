import { apiClient } from "./apiClient";

import type {
  CurrencyConversion,
  CurrencyConversionApiResponse,
  CurrencyConversionPayload,
  SupportedCurrency,
} from "../features/currency/types/currency";

const CURRENCY_URL = "/api/currency";

const normalizeAmount = (value: number | string, fieldName: string): number => {
  const normalizedValue = Number(value);

  if (!Number.isFinite(normalizedValue)) {
    throw new Error(`Invalid ${fieldName} returned by the currency service.`);
  }

  return normalizedValue;
};

export const convertCurrency = async (
  payload: CurrencyConversionPayload,
): Promise<CurrencyConversion> => {
  const amount = Number(payload.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Currency conversion amount must be greater than zero.");
  }

  const response = await apiClient<CurrencyConversionApiResponse>(
    `${CURRENCY_URL}/convert`,
    {
      method: "POST",
      body: JSON.stringify({
        amount,
        from_currency: payload.from_currency,
        to_currency: payload.to_currency,
      }),
    },
  );

  return {
    originalAmount: normalizeAmount(
      response.original_amount,
      "original amount",
    ),
    convertedAmount: normalizeAmount(
      response.converted_amount,
      "converted amount",
    ),
    fromCurrency: response.from_currency,
    toCurrency: response.to_currency,
    exchangeRate: normalizeAmount(response.exchange_rate, "exchange rate"),
  };
};

export const getExchangeRate = async (
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
): Promise<number> => {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const conversion = await convertCurrency({
    amount: 1,
    from_currency: fromCurrency,
    to_currency: toCurrency,
  });

  return conversion.exchangeRate;
};
