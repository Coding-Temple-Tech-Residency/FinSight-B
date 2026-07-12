import { apiClient } from "./apiClient";

import type {
  AddWatchlistPayload,
  WatchlistDeleteResponse,
  WatchlistItem,
} from "../features/watchlist/types/watchlist";

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase();

export const getWatchlist = () => {
  return apiClient<WatchlistItem[]>("/api/watchlist");
};

export const getWatchlistItem = (symbol: string) => {
  return apiClient<WatchlistItem>(`/api/watchlist/${normalizeSymbol(symbol)}`);
};

export const addWatchlistItem = (payload: AddWatchlistPayload) => {
  return apiClient<WatchlistItem>("/api/watchlist", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      symbol: normalizeSymbol(payload.symbol),
    }),
  });
};

export const removeWatchlistItem = (symbol: string) => {
  return apiClient<WatchlistDeleteResponse>(
    `/api/watchlist/${normalizeSymbol(symbol)}`,
    {
      method: "DELETE",
    },
  );
};
