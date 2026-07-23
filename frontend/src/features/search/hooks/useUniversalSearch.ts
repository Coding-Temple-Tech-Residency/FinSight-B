import { useQuery } from "@tanstack/react-query";

import { registerSearchProviders } from "../providers/registerSearchProviders";
import { searchRegistry } from "../registry/searchRegistry";

const MINIMUM_QUERY_LENGTH = 2;

registerSearchProviders();

export const universalSearchKeys = {
  all: ["universal-search"] as const,

  query: (query: string) =>
    [...universalSearchKeys.all, query.trim().toLowerCase()] as const,
};

export const useUniversalSearch = (query: string) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: universalSearchKeys.query(normalizedQuery),

    queryFn: ({ signal }) =>
      searchRegistry.search(normalizedQuery, {
        signal,
      }),

    enabled: normalizedQuery.length >= MINIMUM_QUERY_LENGTH,

    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,

    retry: false,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
