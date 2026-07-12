import { apiClient } from "./apiClient";

import type { MarketHistory } from "../features/market/types/market";
import type { StockQuote } from "../features/market/types/stock";

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase();

export const getStockQuote = (symbol: string) => {
  return apiClient<StockQuote>(`/api/stocks/${normalizeSymbol(symbol)}`);
};

export const getMarketHistory = (symbol: string, timeframe = "daily") => {
  const normalizedSymbol = normalizeSymbol(symbol);

  const params = new URLSearchParams({
    timeframe,
  });

  return apiClient<MarketHistory[]>(
    `/api/stocks/${normalizedSymbol}/history?${params.toString()}`,
  );
};
