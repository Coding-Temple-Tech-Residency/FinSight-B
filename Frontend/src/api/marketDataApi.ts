import { apiClient } from "./apiClient";
import type { MarketHistory } from "../features/market/types/market";
import type { StockQuote } from "../features/market/types/stock";

export const getStockQuote = (symbol: string) => {
  return apiClient<StockQuote>(`/api/stocks/${symbol}`);
};

export const getMarketHistory = (symbol: string) => {
  return apiClient<MarketHistory[]>(`/api/stocks/${symbol}/history`);
};
