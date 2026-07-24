import type { SearchResultType } from "../types/search";

const searchResultColors: Record<SearchResultType, string> = {
  stock: "text-emerald-500",
  portfolio: "text-blue-500",
  watchlist: "text-amber-500",
  page: "text-(--accent-primary)",
  ai: "text-violet-500",
};

export const getSearchResultColor = (type: SearchResultType): string => {
  return searchResultColors[type];
};
