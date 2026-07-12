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

export const holdingKeys = {
  all: ["holdings"] as const,
  byPortfolio: (portfolioId: number) => ["holdings", portfolioId] as const,
};

export const portfolioKeys = {
  all: ["portfolios"] as const,
  detail: (portfolioId: number) => ["portfolio", portfolioId] as const,
};

const isValidPortfolioId = (portfolioId?: number): portfolioId is number => {
  return typeof portfolioId === "number" && portfolioId > 0;
};

export const useHoldings = (portfolioId?: number) => {
  return useQuery({
    queryKey: isValidPortfolioId(portfolioId)
      ? holdingKeys.byPortfolio(portfolioId)
      : [...holdingKeys.all, "disabled"],
    queryFn: () => getHoldings(portfolioId!),
    enabled: isValidPortfolioId(portfolioId),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateHolding = (portfolioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHoldingPayload) => {
      if (!isValidPortfolioId(portfolioId)) {
        throw new Error("A valid portfolio is required.");
      }

      return createHolding(portfolioId, payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: holdingKeys.byPortfolio(portfolioId),
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

export const useUpdateHolding = (portfolioId: number) => {
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
      queryClient.invalidateQueries({
        queryKey: holdingKeys.byPortfolio(portfolioId),
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

export const useDeleteHolding = (portfolioId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (holdingId: number) => {
      if (!isValidPortfolioId(portfolioId)) {
        throw new Error("A valid portfolio is required.");
      }

      return deleteHolding(portfolioId, holdingId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: holdingKeys.byPortfolio(portfolioId),
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
