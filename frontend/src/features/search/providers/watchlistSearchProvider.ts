import { getWatchlist } from "../../../api/watchlistApi";

import type { WatchlistItem } from "../../watchlist/types/watchlist";

import type { UniversalSearchResult } from "../types/search";
import type { SearchProvider } from "../types/searchProvider";

const DEFAULT_RESULT_LIMIT = 6;

const normalizeValue = (value: string | null | undefined): string => {
  return value?.trim().toLowerCase() ?? "";
};

const formatCurrency = (value: number | string | null): string | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const matchesWatchlistItem = (item: WatchlistItem, query: string): boolean => {
  const normalizedQuery = normalizeValue(query);

  if (!normalizedQuery) {
    return false;
  }

  return [item.symbol, item.company_name].some((value) =>
    normalizeValue(value).includes(normalizedQuery),
  );
};

const mapWatchlistItemToSearchResult = (
  item: WatchlistItem,
): UniversalSearchResult => {
  return {
    id: `watchlist-${item.id}`,
    type: "watchlist",
    title: item.symbol.toUpperCase(),
    subtitle: item.company_name,
    badge: "Watchlist",
    trailing: formatCurrency(item.latest_price),
    href: `/dashboard/market?symbol=${encodeURIComponent(
      item.symbol.toUpperCase(),
    )}`,
    data: item,
  };
};

export const watchlistSearchProvider: SearchProvider = {
  id: "watchlist",
  label: "Watchlist",

  async search(query, options): Promise<UniversalSearchResult[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery || options?.signal?.aborted) {
      return [];
    }

    const watchlist = await getWatchlist();

    if (options?.signal?.aborted) {
      return [];
    }

    return watchlist
      .filter((item) => matchesWatchlistItem(item, normalizedQuery))
      .slice(0, DEFAULT_RESULT_LIMIT)
      .map(mapWatchlistItemToSearchResult);
  },
};
