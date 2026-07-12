import { useQuery } from "@tanstack/react-query";

import { getMarketHistory } from "../../../api/marketDataApi";

export const marketHistoryKeys = {
  all: ["market-history"] as const,
  detail: (symbol: string, timeframe: string) =>
    ["market-history", symbol.trim().toUpperCase(), timeframe] as const,
};

export function useMarketHistory(symbol: string, timeframe = "daily") {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return useQuery({
    queryKey: marketHistoryKeys.detail(normalizedSymbol, timeframe),
    queryFn: () => getMarketHistory(normalizedSymbol, timeframe),
    enabled: Boolean(normalizedSymbol),

    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
