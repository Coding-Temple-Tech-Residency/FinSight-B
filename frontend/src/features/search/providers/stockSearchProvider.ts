import { searchStocks } from "../../../api/marketDataApi";

import type { SearchProvider } from "../types/searchProvider";

import { mapStockToSearchResult } from "../utils/mapStockToSearchResult";

const DEFAULT_RESULT_LIMIT = 6;

export const stockSearchProvider: SearchProvider = {
  id: "stocks",
  label: "Stocks",

  async search(query, context) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    if (context?.signal?.aborted) {
      return [];
    }

    const stocks = await searchStocks(normalizedQuery, DEFAULT_RESULT_LIMIT);

    if (context?.signal?.aborted) {
      return [];
    }

    return stocks.map(mapStockToSearchResult);
  },
};
