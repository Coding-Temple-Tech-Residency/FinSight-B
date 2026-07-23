import type { StockSearchResult } from "../../market/types/stock";
import type { UniversalSearchResult } from "../types/search";

const formatStockPrice = (
  value: number | string | null | undefined,
): string | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  return numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const mapStockToSearchResult = (
  stock: StockSearchResult,
): UniversalSearchResult => {
  const normalizedSymbol = stock.symbol.trim().toUpperCase();

  return {
    id: `stock-search-result-${normalizedSymbol}`,
    type: "stock",
    title: normalizedSymbol,
    subtitle: stock.company_name,
    badge: stock.exchange ?? undefined,
    image: stock.company_logo_url,
    trailing: formatStockPrice(stock.latest_price),
    data: stock,
  };
};
