import { useCallback, useState } from "react";

import type { StockSearchResult } from "../../market/types/stock";

const STOCK_SEARCH_HISTORY_KEY = "finsight-stock-search-history";
const MAX_HISTORY_ITEMS = 10;

const isStockSearchResult = (value: unknown): value is StockSearchResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const stock = value as Partial<StockSearchResult>;

  return (
    typeof stock.symbol === "string" && typeof stock.company_name === "string"
  );
};

const readSearchHistory = (): StockSearchResult[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedHistory = window.localStorage.getItem(STOCK_SEARCH_HISTORY_KEY);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory: unknown = JSON.parse(storedHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory
      .filter(isStockSearchResult)
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
};

const writeSearchHistory = (history: StockSearchResult[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      STOCK_SEARCH_HISTORY_KEY,
      JSON.stringify(history),
    );
  } catch {
    // Search history is optional, so storage failures
    // should not prevent the stock search from working.
  }
};

export const useSearchHistory = () => {
  const [recentStocks, setRecentStocks] =
    useState<StockSearchResult[]>(readSearchHistory);

  const addRecentStock = useCallback((stock: StockSearchResult) => {
    setRecentStocks((currentHistory) => {
      const normalizedSymbol = stock.symbol.trim().toUpperCase();

      const nextHistory = [
        {
          ...stock,
          symbol: normalizedSymbol,
        },
        ...currentHistory.filter(
          (historyStock) =>
            historyStock.symbol.trim().toUpperCase() !== normalizedSymbol,
        ),
      ].slice(0, MAX_HISTORY_ITEMS);

      writeSearchHistory(nextHistory);

      return nextHistory;
    });
  }, []);

  const removeRecentStock = useCallback((symbol: string) => {
    const normalizedSymbol = symbol.trim().toUpperCase();

    setRecentStocks((currentHistory) => {
      const nextHistory = currentHistory.filter(
        (stock) => stock.symbol.trim().toUpperCase() !== normalizedSymbol,
      );

      writeSearchHistory(nextHistory);

      return nextHistory;
    });
  }, []);

  const clearRecentStocks = useCallback(() => {
    setRecentStocks([]);

    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.removeItem(STOCK_SEARCH_HISTORY_KEY);
    } catch {
      // Search history is optional.
    }
  }, []);

  return {
    recentStocks,
    addRecentStock,
    removeRecentStock,
    clearRecentStocks,
  };
};
