import { getStockQuote } from "../../../api/marketDataApi";
import { useQuery } from "@tanstack/react-query";

export function useStockQuote(symbol: string) {
  return useQuery({
    queryKey: ["stock-quote", symbol],
    queryFn: () => getStockQuote(symbol),
    enabled: !!symbol,
  });
}
