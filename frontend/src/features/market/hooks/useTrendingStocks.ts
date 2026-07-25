import { useQuery } from "@tanstack/react-query";

import { getTrendingStocks } from "../../../api/marketDataApi";

export const trendingStockKeys = {
  all: ["trending-stocks"] as const,
};

export const useTrendingStocks = () => {
  return useQuery({
    queryKey: trendingStockKeys.all,
    queryFn: getTrendingStocks,

    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,

    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
