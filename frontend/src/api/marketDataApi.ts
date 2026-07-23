import { apiClient } from "./apiClient";

import type { MarketHistory } from "../features/market/types/market";
import type {
  StockQuote,
  StockSearchResult,
} from "../features/market/types/stock";

const normalizeSymbol = (symbol: string) => {
  return symbol.trim().toUpperCase();
};

const normalizeSearchQuery = (query: string) => {
  return query.trim();
};

type StockSearchApiResponse =
  | StockSearchResult[]
  | {
      results?: StockSearchResult[];
      stocks?: StockSearchResult[];
      items?: StockSearchResult[];
    };

const normalizeStockSearchResponse = (
  response: StockSearchApiResponse,
): StockSearchResult[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  if (Array.isArray(response.stocks)) {
    return response.stocks;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  return [];
};

export const getStockQuote = (symbol: string) => {
  return apiClient<StockQuote>(
    `/api/stocks/${encodeURIComponent(normalizeSymbol(symbol))}`,
  );
};

export const getMarketHistory = (symbol: string, timeframe = "daily") => {
  const normalizedSymbol = normalizeSymbol(symbol);

  const params = new URLSearchParams({
    timeframe,
  });

  return apiClient<MarketHistory[]>(
    `/api/stocks/${encodeURIComponent(normalizedSymbol)}/history?${params.toString()}`,
  );
};

export const searchStocks = async (
  query: string,
  limit = 6,
): Promise<StockSearchResult[]> => {
  const normalizedQuery = normalizeSearchQuery(query);

  if (normalizedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    query: normalizedQuery,
    limit: String(limit),
  });

  const response = await apiClient<StockSearchApiResponse>(
    `/api/stocks/search?${params.toString()}`,
  );

  return normalizeStockSearchResponse(response);
};
