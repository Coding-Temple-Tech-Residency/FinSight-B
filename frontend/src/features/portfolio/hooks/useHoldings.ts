import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createHolding,
  deleteHolding,
  getHoldings,
  updateHolding,
} from "../../../api/holdingsApi";

import type {
  CreateHoldingPayload,
  UpdateHoldingPayload,
} from "../types/holdings";

import { portfolioKeys } from "./portfolioKeys";

const isValidPortfolioId = (portfolioId?: number): portfolioId is number => {
  return typeof portfolioId === "number" && portfolioId > 0;
};

export const useHoldings = (portfolioId?: number) => {
  return useQuery({
    queryKey: isValidPortfolioId(portfolioId)
      ? portfolioKeys.holdings(portfolioId)
      : ["holdings", "disabled"],

    queryFn: () => getHoldings(portfolioId!),

    enabled: isValidPortfolioId(portfolioId),

    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateHolding = (portfolioId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHoldingPayload) => {
      if (!isValidPortfolioId(portfolioId)) {
        throw new Error("A valid portfolio is required.");
      }

      return createHolding(portfolioId, payload);
    },

    onSuccess: () => {
      if (!isValidPortfolioId(portfolioId)) return;

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.holdings(portfolioId),
      });

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(portfolioId),
      });

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.all,
      });
    },
  });
};

export const useUpdateHolding = (portfolioId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      holdingId,
      payload,
    }: {
      holdingId: number;
      payload: UpdateHoldingPayload;
    }) => {
      if (!isValidPortfolioId(portfolioId)) {
        throw new Error("A valid portfolio is required.");
      }

      return updateHolding(portfolioId, holdingId, payload);
    },

    onSuccess: () => {
      if (!isValidPortfolioId(portfolioId)) return;

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.holdings(portfolioId),
      });

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(portfolioId),
      });

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.all,
      });
    },
  });
};

export const useDeleteHolding = (portfolioId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (holdingId: number) => {
      if (!isValidPortfolioId(portfolioId)) {
        throw new Error("A valid portfolio is required.");
      }

      return deleteHolding(portfolioId, holdingId);
    },

    onSuccess: () => {
      if (!isValidPortfolioId(portfolioId)) return;

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.holdings(portfolioId),
      });

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.detail(portfolioId),
      });

      queryClient.invalidateQueries({
        queryKey: portfolioKeys.all,
      });
    },
  });
};
