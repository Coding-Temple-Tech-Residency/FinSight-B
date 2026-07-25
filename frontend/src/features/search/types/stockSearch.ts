import type { StockSearchResult } from "../../market/types/stock";

export type StockSuggestion = StockSearchResult;

export type StockSuggestionSelection = {
  symbol: string;
  companyName: string;
  exchange: string | null;
};
