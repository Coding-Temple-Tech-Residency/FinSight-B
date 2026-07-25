import { apiClient } from "./apiClient";

import type { MarketHistory } from "../features/market/types/market";
import type {
  StockQuote,
  StockSearchResult,
} from "../features/market/types/stock";
import type {
  TrendingCategory,
  TrendingStock,
  TrendingStockApiItem,
  TrendingStocksApiResponse,
} from "../features/market/types/trending";

const normalizeSymbol = (symbol: string) => {
  return symbol.trim().toUpperCase();
};

const normalizeSearchQuery = (query: string) => {
  return query.trim();
};

const toFiniteNumber = (
  value: number | string | null | undefined,
): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : null;
};

const parsePercentage = (value: string | null | undefined): number | null => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.replace("%", "").trim();
  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : null;
};

type StockSearchApiItem = Partial<StockSearchResult> & {
  name?: string | null;
  logo_url?: string | null;
};

type StockSearchApiResponse =
  | StockSearchApiItem[]
  | {
      results?: StockSearchApiItem[];
      stocks?: StockSearchApiItem[];
      items?: StockSearchApiItem[];
    };

const normalizeStockSearchItem = (
  item: StockSearchApiItem,
): StockSearchResult | null => {
  const symbol = normalizeSymbol(item.symbol ?? item.display_symbol ?? "");
  const companyName = (item.company_name ?? item.name ?? "").trim();

  if (!symbol || !companyName) {
    return null;
  }

  return {
    id: item.id,
    symbol,
    display_symbol: item.display_symbol?.trim() || symbol,
    company_name: companyName,
    asset_type: item.asset_type ?? null,
    exchange: item.exchange ?? null,
    // sector: item.sector ?? null,
    industry: item.industry ?? null,
    currency: item.currency?.trim().toUpperCase() || null,
    latest_price: item.latest_price ?? null,
    company_logo_url: item.company_logo_url ?? item.logo_url ?? null,
    last_refreshed_at: item.last_refreshed_at ?? null,
    is_enriched: item.is_enriched ?? false,
  };
};

const normalizeStockSearchResponse = (
  response: StockSearchApiResponse,
): StockSearchResult[] => {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response.results)
      ? response.results
      : Array.isArray(response.stocks)
        ? response.stocks
        : Array.isArray(response.items)
          ? response.items
          : [];

  return items
    .map(normalizeStockSearchItem)
    .filter((item): item is StockSearchResult => item !== null);
};

const normalizeTrendingItem = (
  item: TrendingStockApiItem,
  category: TrendingCategory,
  rank: number,
): TrendingStock | null => {
  const symbol = normalizeSymbol(item.ticker);

  if (!symbol) {
    return null;
  }

  return {
    rank,
    symbol,
    company_name: item.company_name?.trim() || null,
    price: toFiniteNumber(item.price),
    change_amount: toFiniteNumber(item.change_amount),
    percentage_change: parsePercentage(item.change_percentage),
    volume: toFiniteNumber(item.volume),
    category,
  };
};

const normalizeTrendingGroup = (
  items: TrendingStockApiItem[],
  category: TrendingCategory,
): TrendingStock[] => {
  return items
    .map((item, index) => normalizeTrendingItem(item, category, index + 1))
    .filter((stock): stock is TrendingStock => stock !== null);
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
    `/api/stocks/${encodeURIComponent(
      normalizedSymbol,
    )}/history?${params.toString()}`,
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

export const getTrendingStocks = async (): Promise<{
  lastUpdated: string | null;
  metadata: string | null;
  topGainers: TrendingStock[];
  topLosers: TrendingStock[];
  mostActive: TrendingStock[];
}> => {
  const response = await apiClient<TrendingStocksApiResponse>(
    "/api/stocks/trending",
  );

  return {
    lastUpdated: response.last_updated,
    metadata: response.metadata,
    topGainers: normalizeTrendingGroup(response.top_gainers, "gainer"),
    topLosers: normalizeTrendingGroup(response.top_losers, "loser"),
    mostActive: normalizeTrendingGroup(response.most_actively_traded, "active"),
  };
};
