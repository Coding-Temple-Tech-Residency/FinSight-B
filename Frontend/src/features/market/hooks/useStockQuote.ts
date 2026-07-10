import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "../../../api/marketDataApi";

export function useStockQuote(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return useQuery({
    queryKey: ["stock-quote", normalizedSymbol],
    queryFn: () => getStockQuote(normalizedSymbol),
    enabled: Boolean(normalizedSymbol),

    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,

    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}
