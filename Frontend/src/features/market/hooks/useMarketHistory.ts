import { useQuery } from "@tanstack/react-query";
import { getMarketHistory } from "../../../api/marketDataApi";

export function useMarketHistory(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return useQuery({
    queryKey: ["market-history", normalizedSymbol],
    queryFn: () => getMarketHistory(normalizedSymbol),
    enabled: Boolean(normalizedSymbol),

    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
