import { apiClient } from "./apiClient";
import type {
  AddWatchlistPayload,
  WatchlistItem,
} from "../features/watchlist/types/watchlist";

export const getWatchlist = () => {
  return apiClient<WatchlistItem[]>("/api/watchlist");
};

export const getWatchlistItem = (symbol: string) => {
  return apiClient<WatchlistItem>(`/api/watchlist/${symbol.toUpperCase()}`);
};

export const addWatchlistItem = (payload: AddWatchlistPayload) => {
  return apiClient<WatchlistItem>("/api/watchlist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const removeWatchlistItem = (symbol: string) => {
  return apiClient<void>(`/api/watchlist/${symbol.toUpperCase()}`, {
    method: "DELETE",
  });
};
