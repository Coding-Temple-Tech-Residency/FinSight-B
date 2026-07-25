import type { StockSearchResult } from "../../market/types/stock";

import type { UniversalSearchResult } from "../types/search";

const formatStockPrice = (
  value: number | string | null | undefined,
  currency = "USD",
): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  try {
    return numericValue.toLocaleString("en-US", {
      style: "currency",
      currency,
    });
  } catch {
    return `${numericValue.toLocaleString("en-US")} ${currency}`;
  }
};

export const mapStockToSearchResult = (
  stock: StockSearchResult,
): UniversalSearchResult => {
  const normalizedSymbol = stock.symbol.trim().toUpperCase();
  const companyName = stock.company_name.trim() || normalizedSymbol;
  const currency = stock.currency?.trim().toUpperCase() || "USD";

  return {
    id: `stock-${stock.id ?? normalizedSymbol}`,
    type: "stock",
    title: `${companyName} (${normalizedSymbol})`,
    subtitle: stock.industry ?? stock.asset_type ?? undefined,
    badge: stock.exchange ?? currency,
    image: stock.company_logo_url ?? null,
    trailing: formatStockPrice(stock.latest_price, currency),
    href: `/dashboard/market?symbol=${encodeURIComponent(normalizedSymbol)}`,
    data: stock,
  };
};
