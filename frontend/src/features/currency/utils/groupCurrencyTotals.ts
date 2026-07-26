import type { CurrencyTotals, SupportedCurrency } from "../types/currency";

export type CurrencyTotalSource = {
  currency: SupportedCurrency | string | null | undefined;
  marketValue?: number | string | null;
  costBasis?: number | string | null;
  gainLoss?: number | string | null;
  holdingsCount?: number | null;
};

const normalizeCurrency = (
  currency: CurrencyTotalSource["currency"],
): SupportedCurrency | null => {
  if (!currency) {
    return null;
  }

  const normalizedCurrency = currency.trim().toUpperCase();

  switch (normalizedCurrency) {
    case "USD":
    case "EUR":
    case "GBP":
    case "JPY":
    case "CHF":
    case "CAD":
    case "AUD":
      return normalizedCurrency;

    default:
      return null;
  }
};

const normalizeNumber = (value: number | string | null | undefined): number => {
  const normalizedValue = Number(value ?? 0);

  return Number.isFinite(normalizedValue) ? normalizedValue : 0;
};

export const groupCurrencyTotals = (
  values: CurrencyTotalSource[],
): CurrencyTotals[] => {
  const groupedTotals = new Map<SupportedCurrency, CurrencyTotals>();

  values.forEach((value) => {
    const currency = normalizeCurrency(value.currency);

    if (!currency) {
      return;
    }

    const currentTotal = groupedTotals.get(currency) ?? {
      currency,
      marketValue: 0,
      costBasis: 0,
      gainLoss: 0,
      holdingsCount: 0,
    };

    currentTotal.marketValue += normalizeNumber(value.marketValue);
    currentTotal.costBasis += normalizeNumber(value.costBasis);
    currentTotal.gainLoss += normalizeNumber(value.gainLoss);
    currentTotal.holdingsCount += Math.max(
      0,
      Math.trunc(normalizeNumber(value.holdingsCount)),
    );

    groupedTotals.set(currency, currentTotal);
  });

  return Array.from(groupedTotals.values()).sort((first, second) =>
    first.currency.localeCompare(second.currency),
  );
};

export const getCurrencyTotal = (
  totals: CurrencyTotals[],
  currency: SupportedCurrency,
): CurrencyTotals | undefined => {
  return totals.find((total) => total.currency === currency);
};
