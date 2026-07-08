import { useQuery } from "@tanstack/react-query";
import { getMarketHistory } from "../../../api/marketDataApi";

export function useMarketHistory(symbol: string) {
  return useQuery({
    queryKey: ["market-history", symbol],
    queryFn: () => getMarketHistory(symbol),
    enabled: !!symbol,
  });
}
