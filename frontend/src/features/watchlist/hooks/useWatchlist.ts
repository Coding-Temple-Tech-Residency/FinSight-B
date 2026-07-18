import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addWatchlistItem,
  getWatchlist,
  removeWatchlistItem,
} from "../../../api/watchlistApi";

import type { AddWatchlistPayload, WatchlistItem } from "../types/watchlist";

export const watchlistKeys = {
  all: ["watchlist"] as const,

  item: (symbol: string) =>
    [...watchlistKeys.all, symbol.trim().toUpperCase()] as const,
};

export const useWatchlist = () => {
  return useQuery({
    queryKey: watchlistKeys.all,
    queryFn: getWatchlist,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddWatchlistPayload) => addWatchlistItem(payload),

    onSuccess: (newItem) => {
      queryClient.setQueryData<WatchlistItem[]>(
        watchlistKeys.all,
        (currentItems = []) => {
          const alreadyExists = currentItems.some(
            (item) =>
              item.symbol.toUpperCase() === newItem.symbol.toUpperCase(),
          );

          if (alreadyExists) {
            return currentItems;
          }

          return [newItem, ...currentItems];
        },
      );

      queryClient.setQueryData(watchlistKeys.item(newItem.symbol), newItem);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: watchlistKeys.all,
      });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (symbol: string) => removeWatchlistItem(symbol),

    onSuccess: (_, symbol) => {
      const normalizedSymbol = symbol.trim().toUpperCase();

      queryClient.setQueryData<WatchlistItem[]>(
        watchlistKeys.all,
        (currentItems = []) =>
          currentItems.filter(
            (item) => item.symbol.toUpperCase() !== normalizedSymbol,
          ),
      );

      queryClient.removeQueries({
        queryKey: watchlistKeys.item(normalizedSymbol),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: watchlistKeys.all,
      });
    },
  });
};
