export type CurrencyValue = number | string | null | undefined;

const DEFAULT_CURRENCY = "USD";

export const normalizeCurrencyCode = (
  currency: string | null | undefined,
): string => {
  const normalizedCurrency = currency?.trim().toUpperCase();

  return normalizedCurrency || DEFAULT_CURRENCY;
};

export const toFiniteNumber = (value: CurrencyValue): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

export const formatCurrency = (
  value: CurrencyValue,
  currency: string | null | undefined = DEFAULT_CURRENCY,
): string => {
  const numericValue = toFiniteNumber(value);

  if (numericValue === null) {
    return "Unavailable";
  }

  const currencyCode = normalizeCurrencyCode(currency);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    return `${currencyCode} ${numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};
