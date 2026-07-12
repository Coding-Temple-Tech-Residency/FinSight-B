import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addWatchlistItem,
  getWatchlist,
  removeWatchlistItem,
} from "../../../api/watchlistApi";

export const watchlistKeys = {
  all: ["watchlist"] as const,
  item: (symbol: string) => ["watchlist", symbol.trim().toUpperCase()] as const,
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
    mutationFn: addWatchlistItem,

    onSuccess: (newItem) => {
      queryClient.invalidateQueries({
        queryKey: watchlistKeys.all,
      });

      queryClient.setQueryData(watchlistKeys.item(newItem.symbol), newItem);
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWatchlistItem,

    onSuccess: (_, symbol) => {
      queryClient.removeQueries({
        queryKey: watchlistKeys.item(symbol),
      });

      queryClient.invalidateQueries({
        queryKey: watchlistKeys.all,
      });
    },
  });
};
