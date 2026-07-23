import { useQuery } from "@tanstack/react-query";

import { searchStocks } from "../../../api/marketDataApi";

const MINIMUM_QUERY_LENGTH = 2;
const DEFAULT_RESULT_LIMIT = 6;

export const stockSearchKeys = {
  all: ["stock-search"] as const,

  query: (query: string, limit: number) =>
    [...stockSearchKeys.all, query.trim().toLowerCase(), limit] as const,
};

export const useStockSearch = (query: string, limit = DEFAULT_RESULT_LIMIT) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: stockSearchKeys.query(normalizedQuery, limit),

    queryFn: () => searchStocks(normalizedQuery, limit),

    enabled: normalizedQuery.length >= MINIMUM_QUERY_LENGTH,

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,

    retry: false,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
